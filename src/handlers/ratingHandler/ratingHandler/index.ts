import {Context} from "grammy";
import {findUserOrCreate, TelegramUser} from "~/repositories/userRepository";
import {user, rating_ledger} from '@prisma/client';
import {prismaClient} from "~/db";
import {getUserName} from "~/helpers";

require('dotenv').config();

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

export const getUserRating = (targetUser: user): Promise<number | null> => {
    return prismaClient.rating_ledger.aggregate({
        _sum: {
            value: true,
        },
        where: {
            user_id_to: targetUser.id,
        },
    })
        .then((res): number => {
            const totalRating = res._sum.value || 0;
            return totalRating;
        })
        .catch((e) => {
            console.error(`Ошибка при подсчёте рейтинга пользователя: ${e}`);
            // Возвращает null в случае ошибки, согласно измененному типу функции
            return null;
        });
}

const getUserRatingMessage = async (targetUser: user): Promise<string> => {
    const userName = targetUser.username || targetUser.name || `#${targetUser.tg_id}`;
    try {
        const rating = await getUserRating(targetUser);
        if (rating === null) {
            console.error(`Ошибка при подсчёте рейтинга пользователя: ${userName}`);
            return "Не удалось получить рейтинг пользователя из-за ошибки.";
        } else {
            const ratingEmoji = rating >= 0 ? '😎' : '👎';
            return `Рейтинг пользователя ${userName}: ${rating} ${ratingEmoji}`;
        }
    } catch (error) {
        console.error(`Ошибка при подсчёте рейтинга пользователя: ${error}`);
        return "Произошла ошибка при попытке получить рейтинг.";
    }
}

export const ratingMessage = async (ctx: Context) => {
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
                }
            })
    }
};