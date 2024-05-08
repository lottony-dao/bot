import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWalletIdByUserId = async (userId: number, tokenId: number): Promise<number> => {
    // Получаем первый кошелек пользователя
    const wallet = await prisma.wallet.findFirst({
        where: {
            user_id: userId
        },
        select: {
            id: true  // Выбираем только поле id
        }
    });

    return wallet ? wallet.id : -1;  // Возвращаем id кошелька или null, если кошелек не найден
};
