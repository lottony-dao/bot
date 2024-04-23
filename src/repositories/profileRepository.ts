import {prismaClient} from "~/db";
import {user} from '@prisma/client';
import {getUserRating} from './ratingHistoryRepository';
import {findUserOrCreate} from "~/repositories/userRepository";
import {Context} from "grammy";

export const userProfile = async (ctx: Context) => {
    const telegramUser = ctx.message?.reply_to_message?.from;

    if (telegramUser) {
        try {

            const targetUser = await findUserOrCreate({
                id: telegramUser.id,
                is_bot: telegramUser.is_bot,
                first_name: telegramUser.first_name,
                username: telegramUser.username
            });

            if (targetUser) {
                const profile = {
                    name: targetUser.username || targetUser.name || `#${targetUser.id}`,
                    rating: await getUserRating(targetUser),
                    level: targetUser.level,
                };

                await ctx.reply(
                    `Имя: ${profile.name},\n\nРейтинг: ${profile.rating},\n\nУровень: ${profile.level}`);
            } else {
                await ctx.reply('Пользователь не найден.');
            }
        } catch (error) {
            console.error(`Ошибка при получении профиля пользователя: ${error}`);
            await ctx.reply('Произошла ошибка при попытке получить информацию о пользователе.');
        }
    } else {
        await ctx.reply('Команда должна быть ответом на сообщение пользователя.');
    }
};
