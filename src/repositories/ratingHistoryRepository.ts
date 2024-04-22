import {prismaClient} from "~/db";
import { user } from '@prisma/client';

export const getUserRating = (tg_id: number): Promise<number | null> => {
    return prismaClient.rating_history.aggregate({
        _sum: {
            rate_value: true,
        },
        where: {
            to_user: tg_id,
        },
    })
        .then((res) => {
            return res._sum.rate_value || 0
        })
        .catch((e) => {
            console.error(e);
            return null;
        })
}