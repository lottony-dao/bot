import { PrismaClient } from '@prisma/client';
import { Context } from "grammy";

const prisma = new PrismaClient();

export async function checkUserActivity(ctx: Context): Promise<boolean> {
    const fromUser = ctx.message?.from;
    const toUser = ctx.message?.reply_to_message?.from;

    if (!fromUser || !toUser) {
        return false; // Если нет информации о пользователях
    }else if(fromUser.id === toUser.id)
    {
        ctx.reply('Ты сам себе не режиссер!!!'); // Если пользователь пытается изменить свой рейтинг
        return false;
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

    return changesToday > 0;
}
