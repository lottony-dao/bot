import {user} from "@prisma/client";
import {prismaClient} from "~/db";

export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
}

export const findUserOrCreate = (from: TelegramUser): Promise<user | null> => {
    return prismaClient.user.findUnique({
        where: {tg_id: from.id},
    })
        .then((user) => {
            return user || prismaClient.user.create({
                data: {
                    tg_id: from.id,
                    name: from.first_name,
                    nickname: from.username || null,
                },
            });
        })
        .catch((e) => {
            console.error(`Ошибка при поиске или создании пользователя: ${e}`);
            return null;
        })
}