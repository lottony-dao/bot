import {PrismaClient} from '@prisma/client';
import {Context} from "grammy";
import {getTokenIdByName} from "~/services/tokenService/tokenService";
import {getWalletIdByUserId} from "~/services/walletService";

const prisma = new PrismaClient();

export const tokenTransferMessage = async (ctx: Context) => {
    const text = ctx.message?.text;
    if (!text) return;

    // Проверка наличия данных о пользователе
    if (!ctx.from) {
        ctx.reply("Не удается идентифицировать пользователя.");
        return;
    }

    const parts = text.match(/^(\d+)(\w+)$/);
    if (parts) {
        const amount = parseInt(parts[1]);
        const tokenName = parts[2];
        try {
            const tokenId = await getTokenIdByName(tokenName);
            const fromWalletId = await getWalletIdByUserId(ctx.from.id, tokenId);
            const toWalletId = await getWalletIdByUserId(ctx.message.reply_to_message?.from?.id, tokenId);
            await transferCommand(ctx, fromWalletId, toWalletId, tokenId, amount);
        } catch (error) {
            if (error instanceof Error) {
                ctx.reply(`Ошибка: ${error.message}`);
            } else {
                console.log('Произошла ошибка, но она не типа Error');
            }
        }
    } else {
        ctx.reply("Пожалуйста, отправьте сообщение в формате 'количество название_жетона'. Пример: '20 BTC'");
    }
};

export const transferCommand = async (ctx: Context, fromWalletId: number, toWalletId: number, tokenId: number, amount: number) => {
    try {
        const transaction = await transferTokens(fromWalletId, toWalletId, tokenId, amount);
        ctx.reply(`Перевод успешно выполнен: ID транзакции ${transaction.id}`);
    } catch (e) {
        ctx.reply(`Ошибка: ${e instanceof Error ? e.message : "Неизвестная ошибка"}`);
    }
};

export const transferTokens = async (
    fromWalletId: number,
    toWalletId: number,
    token_Id: number,
    amount: number
): Promise<any> => {
    // Транзакция для создания записей о переводе жетонов
    const transaction = await prisma.$transaction(async (prisma) => {
        return await prisma.balance_ledger.create({
            data: {
                wallet_id_from: fromWalletId,
                wallet_id_to: toWalletId,
                jetton_id: token_Id,
                value: amount,
                created_at: new Date()
            }
        });
    });

    return transaction;
};
