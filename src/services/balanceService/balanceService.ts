import { PrismaClient } from '@prisma/client';
import {Context} from "grammy";
import {getTokenIdByName} from "~/services/tokenService/tokenService";
import {getWalletIdByUserId} from "~/services/walletService";

const prisma = new PrismaClient();

// Функция для разбора сообщения и вызова функции перевода
export const parseTransfer = async (ctx: Context) => {
    const text = ctx.message?.text;
    if (!text) return;

    const parts = text.match(/^(\d+) (\w+)$/);
    if (parts) {
        const amount = parseInt(parts[1]);
        const tokenName = parts[2];
        const tokenId = getTokenIdByName(tokenName);      // Пример, вам нужно будет определить ID на основе jettonName

        // Допустим, что fromWalletId и toWalletId вы получаете каким-то образом
        const fromWalletId = getWalletIdByUserId(1, await tokenId);
        const toWalletId = getWalletIdByUserId(1, await tokenId);
        transferCommand(ctx, await fromWalletId, await toWalletId, await tokenId, amount);
    } else {
        ctx.reply("Пожалуйста, отправьте сообщение в формате 'количество название_жетона'. Пример: '20 Ton'");
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
