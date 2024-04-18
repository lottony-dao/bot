import {getUserName} from "~/helpers";

require('dotenv').config();

import {Context} from "grammy";
import {user} from '@prisma/client';
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
    prismaClient.rating_history.findFirst({
        where: {
            from_user: {
                equals: ratingChange.from.tg_id
            },
            to_user: {
                equals: ratingChange.to.tg_id
            },
            created_at: {
                gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
                lt: new Date(new Date().setUTCHours(24, 0, 0, 0))
            }
        },
    })
        .then((row) => {
            if (row) {
                ctx.reply(`Попробуй завтра, ${getUserName(ratingChange.from)}!`)
            } else {
                prismaClient.rating_history.create({
                    data: {
                        from_user: ratingChange.from.tg_id,
                        to_user: ratingChange.to.tg_id,
                        rate_value: ratingChange.value,
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
                    .catch((e) => {
                        console.error(e);
                        ctx.reply("Произошла ошибка при попытке изменить рейтинг. Пожалуйста, попробуйте позже.");
                    })
            }
        })
        .catch((e) => {
            console.error(e);
        })
}

// Исправленное объявление обработчика событий
// Функция для подсчёта и вывода текущего рейтинга пользователя
const getUserRatingMessage = (targetUser: user): Promise<string> => {
    return prismaClient.rating_history.aggregate({
        _sum: {
            rate_value: true,
        },
        where: {
            to_user: targetUser.tg_id,
        },
    })
        .then((res) => {
            const totalRating = res._sum.rate_value || 0;
            const ratingEmoji = totalRating >= 0 ? '😎' : '👎';
            return `Рейтинг пользователя ${targetUser.nickname || targetUser.name}: ${totalRating} ${ratingEmoji}`;
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
    let msg = ctx.message?.text || '',
        fromUser = ctx.message?.from;

    if (fromUser && !fromUser.is_bot) {
        findUserOrCreate(fromUser)
            .then((user) => {
                if (!user) {
                    console.error(`Пользователь ${fromUser?.id} не найден`)
                    ctx.reply(`Пользователь не найден, странно...`)
                } else {
                    if (ctx.message?.reply_to_message?.from) {
                        const targetTelegramUser = ctx.message.reply_to_message.from;

                        findUserOrCreate(targetTelegramUser)
                            .then((targetUser) => {
                                if (!targetUser) {
                                    console.error(`Пользователь ${targetTelegramUser?.id} не найден`)
                                    ctx.reply(`Пользователь не найден, странно...`)
                                } else {
                                    switch (msg.toLowerCase().trim()) {
                                        case "+rep":
                                        case "+реп":
                                            if (ctx.message?.reply_to_message?.from?.id != ctx.message?.from.id) {
                                                recordRatingChange({from: user, to: targetUser, value: 1}, ctx);
                                            }
                                            break;
                                        case "-rep":
                                        case "-реп":
                                            if (ctx.message?.reply_to_message?.from?.id != ctx.message?.from.id) {
                                                recordRatingChange({from: user, to: targetUser, value: -1}, ctx);
                                            }
                                            break;
                                    }
                                }
                            })

                    } else {
                        switch (msg.toLowerCase().trim()) {
                            case "?rep":
                            case "?реп":
                                getUserRatingMessage(user); // Вызов функции для вывода рейтинга
                                break;
                            default:
                                defaultAnswer(ctx);
                        }
                    }
                }
            })
    }
};
