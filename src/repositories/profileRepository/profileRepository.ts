import {getUserRating} from '~/repositories/ratingRepository/ratingRepository';
import {findUserOrCreate} from "~/repositories/userRepository";
import {Context} from "grammy";

export const userProfile = async (ctx: Context) => {
    let telegramUser = ctx.message?.reply_to_message?.from;

    if(!telegramUser){
        telegramUser = ctx.message?.from;
    }
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
                };

                await ctx.reply(
                    `Имя: ${profile.name},\nРейтинг: ${profile.rating}`);
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