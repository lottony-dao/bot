require('dotenv').config();

import { Context } from "grammy";
import { PrismaClient, user } from '@prisma/client';

const prisma = new PrismaClient();

const personalRepliesMap: { [key: number]: string } = {
    0: "But... How? 😨",
    5698437506: "Fucking legend 🥶",
};

interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
}

interface RatingChange {
    from: user;
    to: user;
    value: number;
}

async function findUserOrCreate(from: TelegramUser): Promise<user | null> {
    try {
        if (from.is_bot) return null;

        let user = await prisma.user.findUnique({
            where: { tg_id: from.id },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    tg_id: from.id,
                    name: from.first_name,
                    nickname: from.username || null,
                },
            });
        }

        return user;
    } catch (error) {
        console.error(`Ошибка при поиске или создании пользователя: ${error}`);
        return null;
    }
}

async function recordRatingChange(ratingChange: RatingChange, ctx: Context): Promise<void> {
    try {
        await prisma.rating_history.create({
            data: {
                from_user: ratingChange.from.tg_id,
                to_user: ratingChange.to.tg_id,
                rate_value: ratingChange.value,
            },
        });

        // Получаем строку с текущим рейтингом пользователя
        const ratingMessage = await showUserRating(ratingChange.to);

        let ratingEmoji = ratingChange.value > 0 ? '👍' : '👎';
        let replyTarget = ctx.message?.reply_to_message?.from?.is_bot ? 'бота' : 'пользователя';
        let fromName = ratingChange.from.nickname || ratingChange.from.name;
        let toName = ratingChange.to.nickname || ratingChange.to.name;

        // Теперь сообщение об изменении рейтинга также включает текущий рейтинг
        await ctx.reply(`${fromName} изменил рейтинг ${replyTarget} ${toName} ${ratingEmoji}\n${ratingMessage}`);
    } catch (error) {
        console.error(`Ошибка при записи изменения рейтинга: ${error}`);
        await ctx.reply("Произошла ошибка при попытке изменить рейтинг. Пожалуйста, попробуйте позже.");
    }
}

// Исправленное объявление обработчика событий
// Функция для подсчёта и вывода текущего рейтинга пользователя
async function showUserRating(targetUser: user, ctx?: Context): Promise<string> {
    try {
        const ratingResult = await prisma.rating_history.aggregate({
            _sum: {
                rate_value: true,
            },
            where: {
                to_user: targetUser.tg_id,
            },
        });

        const totalRating = ratingResult._sum.rate_value || 0;
        const ratingEmoji = totalRating >= 0 ? '😎' : '👎';
        const ratingMessage = `Рейтинг пользователя ${targetUser.nickname || targetUser.name}: ${totalRating} ${ratingEmoji}`;

        // Если контекст передан, отправляем сообщение, иначе просто возвращаем строку
        if (ctx) {
            await ctx.reply(ratingMessage);
        }

        return ratingMessage;
    } catch (error) {
        console.error(`Ошибка при подсчёте рейтинга пользователя: ${error}`);
        return "Произошла ошибка при попытке получить рейтинг.";
    }
}

function defaultAnswer(ctx: Context){
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
                reply_parameters: { message_id: ctx.message?.message_id },
            });
        } else {
            ctx.reply(text);
        }
    }
}


// Обновлённый обработчик сообщений
export const handleMessage = async (ctx: Context) => {
    let msg = ctx.message?.text || '';
    let fromUser = ctx.message?.from;
    if (fromUser) {
        const user = await findUserOrCreate(fromUser);
        if (user && ctx.message?.reply_to_message?.from ) {
            const targetTelegramUser = ctx.message.reply_to_message.from;
            const targetUser = await findUserOrCreate(targetTelegramUser);

            if (targetUser) {
                switch (msg.toLowerCase().trim()) {
                    case "+rep":
                    case "+реп":
                        if(ctx.message?.reply_to_message?.from.id != ctx.message?.from.id){
                            await recordRatingChange({ from: user, to: targetUser, value: 1 }, ctx);
                        }
                        break;
                    case "-rep":
                    case "-реп":
                        if(ctx.message?.reply_to_message?.from.id != ctx.message?.from.id){
                            await recordRatingChange({ from: user, to: targetUser, value: -1 }, ctx);
                        }
                        break;
                    case "?rep":
                    case "?реп":
                        await showUserRating(targetUser, ctx); // Вызов функции для вывода рейтинга
                        break;
                    default:
                        defaultAnswer(ctx);
                }
            }
        }
        else if (user){
            switch (msg.toLowerCase().trim()){
                case "?rep":
                case "?реп":
                    await showUserRating(user, ctx); // Вызов функции для вывода рейтинга
                    break;
                default:
                    defaultAnswer(ctx);
            }
        }
    }
};
