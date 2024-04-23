import {prismaClient} from "~/db";
import { user } from '@prisma/client';

export const getUserRating = (targetUser: user): Promise<string> => {
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