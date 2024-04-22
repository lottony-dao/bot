import {getUserName} from "~/helpers";

require('dotenv').config();

import {Context} from "grammy";
import {user, rating_ledger} from '@prisma/client';
import {prismaClient} from "~/db";
import {findUserOrCreate} from "~/repositories/userRepository";

const personalRepliesMap: { [key: number]: string } = {
    0: "But... How? 😨",
    5698437506: "Fucking legend 🥶",
};

interface RatingChange {
    from: user;
    to: user;
    value: number;
}

const recordRatingChange = (ratingChange: RatingChange, ctx: Context): void => {
    prismaClient.rating_ledger.findFirst({
        where: {
            user_id_from: {
                equals: ratingChange.from.id
            },
            user_id_to: {
                equals: ratingChange.to.id
            },
            created_at: {
                gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                lt: new Date(new Date().setUTCHours(24, 0, 0, 0))
            }
        },
    })
        .then((row: rating_ledger | null) => {
            if (row) {
                ctx.reply(`Попробуй завтра, ${getUserName(ratingChange.from)}!`)
            } else {
                prismaClient.rating_ledger.create({
                    data: {
                        user_id_from: ratingChange.from.id,
                        user_id_to: ratingChange.to.id,
                        value: ratingChange.value,
                    },
                })
                    .then((res) => {
                        let ratingEmoji = ratingChange.value > 0 ? '👍' : '👎';
                        let replyTarget = ctx.message?.reply_to_message?.from?.is_bot ? 'бота' : 'пользователя';

                        getUserRatingMessage(ratingChange.to)
                            .then((ratingText: string) => {
                                ctx.reply(
                                    `${getUserName(ratingChange.from)} изменил рейтинг ${replyTarget} ${getUserName(ratingChange.to)} ${ratingEmoji}` +
                                    `\n${ratingText}`
                                );
                            })
                    })
                    .catch((e: any) => {
                        console.error(e);
                        ctx.reply("Произошла ошибка при попытке изменить рейтинг. Пожалуйста, попробуйте позже.");
                    })
            }
        })
        .catch((e) => {
            console.error(e);
        })
}

// Функция для подсчёта и вывода текущего рейтинга пользователя
const getUserRatingMessage = (targetUser: user): Promise<string> => {
    return prismaClient.rating_ledger.aggregate({
        _sum: {
            value: true,
        },
        where: {
            user_id_to: targetUser.id,
        },
    })
        .then((res) => {
            const totalRating = res._sum.value || 0;
            const ratingEmoji = totalRating >= 0 ? '😎' : '👎';
            return `Рейтинг пользователя ${targetUser.username || targetUser.name}: ${totalRating} ${ratingEmoji}`;
        })
        .catch((e) => {
            console.error(`Ошибка при подсчёте рейтинга пользователя: ${e}`);
            return "Произошла ошибка при попытке получить рейтинг.";
        })
}

function defaultAnswer(ctx: Context) {
    let id = ctx.message?.from.id || 0,
        text = personalRepliesMap[id] || '',
        max = 1000,
        min = 1,
        rand = Math.floor(
            Math.random() * (max - min + 1) + min
        );

    if (rand === 69 && text) {
        if (ctx.message?.message_id) {
            ctx.reply(text, {
                reply_parameters: {message_id: ctx.message?.message_id},
            });
        } else {
            ctx.reply(text);
        }
    }
}

// Обновлённый обработчик сообщений
export const handleMessage = async (ctx: Context) => {
    const msg = ctx.message?.text || '',
        fromUser = ctx.message?.from,
        targetTelegramUser = ctx.message?.reply_to_message?.from;

    if (!fromUser || (ctx.message?.reply_to_message && !targetTelegramUser)) {
        console.error(`Пользователь ${fromUser?.id} не найден`)
        throw new Error(`Пользователь не найден, странно...`)
    }

    if (!fromUser.is_bot) {
            findUserOrCreate(fromUser)
                .then(async (user) => {
                    let targetUser;

                    if (targetTelegramUser)
                        targetUser = await findUserOrCreate(targetTelegramUser)

                    if (targetUser) {
                        switch (msg.toLowerCase().trim()) {
                            case "+rep":
                            case "+реп":
                                if (targetTelegramUser && targetTelegramUser.id != fromUser.id) {
                                    recordRatingChange({from: user, to: targetUser, value: 1}, ctx);
                                }
                                break;
                            case "-rep":
                            case "-реп":
                                if (targetTelegramUser && targetTelegramUser.id != fromUser.id) {
                                    recordRatingChange({from: user, to: targetUser, value: -1}, ctx);
                                }
                                break;
                        }
                    }

                    switch (msg.toLowerCase().trim()) {
                        case "?rep":
                        case "?реп":
                            getUserRatingMessage(targetUser || user)
                                .then((msg: string) => ctx.reply(msg)) // Вызов функции для вывода рейтинга
                            break;
                        default:
                            defaultAnswer(ctx);
                    }
                })
        }
};
