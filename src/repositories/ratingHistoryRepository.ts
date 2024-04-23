import {prismaClient} from "~/db";
import { user } from '@prisma/client';

export const getUserRating = (tg_id: number): Promise<number | null> => {
    return prismaClient.rating_ledger.aggregate({
        _sum: {
            value: true,
        },
        where: {
            user_id_to: tg_id,
        },
    })
        .then((res) => {
            return res._sum.value || 0
        })
        .catch((e) => {
            console.error(e);
            return null;
        })
}