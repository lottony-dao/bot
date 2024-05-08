import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTokenIdByName = async (tokenName: string): Promise<number> => {
    // Получаем первый жетон пользователя
    const jetton = await prisma.jetton.findFirst({
        where: {
            ticker: tokenName
        },
        select: {
            id: true  // Выбираем только поле id
        }
    });

    return jetton ? jetton.id : -1;  // Возвращаем id жетона или null, если жетон не найден
};
