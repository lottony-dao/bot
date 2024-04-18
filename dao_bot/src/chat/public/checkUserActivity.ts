import {PrismaClient} from '@prisma/client';
import {Context} from "grammy";

const prisma = new PrismaClient();

export async function checkUserActivity(ctx: Context): Promise<boolean> {
    const fromUser = ctx.message?.from;
    const toUser = ctx.message?.reply_to_message?.from;
    const text = ctx.message?.text?.toLowerCase().trim();

    if (text === '?rep' || text === '?реп') {
        return false;
    } else if (!fromUser || !toUser) {
        ctx.reply('Не нашли информацию о пользователе!!!');
        return true; // Если нет информации о пользователях
    } else if (fromUser.id === toUser.id) {
        ctx.reply('Ты сам себе не режиссер!!!'); // Если пользователь пытается изменить свой рейтинг
        return true;
    }

    // Формирование диапазона дат для текущего дня
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Проверка наличия изменений рейтинга в базе данных
    const changesToday = await prisma.rating_history.count({
        where: {
            from_user: fromUser.id,
            to_user: toUser.id,
            created_at: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
    });
    const username = ctx.from?.username || ctx.from?.first_name || ctx.from?.id;
    ctx.reply(`${username} - не надо жульничать, сегодня ты уже баловался этим.`);
    return changesToday > 0;
}
