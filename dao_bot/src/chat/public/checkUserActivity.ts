import { PrismaClient } from '@prisma/client';
import { Context } from "grammy";

const prisma = new PrismaClient();

export async function checkUserActivity(ctx: Context): Promise<boolean> {
    const fromUser = ctx.message?.from;
    const toUser = ctx.message?.reply_to_message?.from;

    if (!fromUser || !toUser || fromUser.id === toUser.id) {
        return false; // Если нет информации о пользователях или пользователь пытается изменить свой рейтинг
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
