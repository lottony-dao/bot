import { user } from '@prisma/client';
import { prismaClient } from '~/db';

export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
}

/**
 * Поиск пользователя в базе данных по телеграм ID.
 * @param from - данные пользователя Telegram.
 * @returns Объект пользователя или null, если пользователь не найден.
 */
export const findUser = async (from: TelegramUser): Promise<user | null> => {
    try {
        const foundUser = await prismaClient.user.findUnique({
            where: { tg_id: from.id },
        });
        return foundUser;
    } catch (e) {
        console.error(`Ошибка при поиске пользователя: ${e}`);
        throw new Error('Ошибка при поиске пользователя');
    }
}

/**
 * Создание нового пользователя в базе данных.
 * @param from - данные пользователя Telegram.
 * @returns Новосозданный объект пользователя.
 */
export const createUser = async (from: TelegramUser): Promise<user> => {
    try {
        const newUser = await prismaClient.user.create({
            data: {
                tg_id: from.id,
                name: from.first_name,
                username: from.username ? [from.username] : [],
            },
        });
        return newUser;
    } catch (e) {
        console.error(`Ошибка при создании пользователя: ${e}`);
        throw new Error('Ошибка при создании пользователя');
    }
}

/**
 * Находит или создает пользователя в базе данных.
 * @param from - данные пользователя Telegram.
 * @returns Объект пользователя.
 */
export const findUserOrCreate = async (from: TelegramUser): Promise<user> => {
    const existingUser = await findUser(from);
    if (existingUser) {
        return existingUser;
    } else {
        return createUser(from);
    }
}
