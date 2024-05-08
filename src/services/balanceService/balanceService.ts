import {PrismaClient} from '@prisma/client';
import {Context} from "grammy";
import {getJettonIdByName} from "~/services/tokenService/tokenService";
import {getWalletIdByUserId} from "~/services/walletService";

const prisma = new PrismaClient();

export const jettonTransferMessage = async (ctx: Context) => {
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
        const jettonName = parts[2];
        try {
            const jettonId = await getJettonIdByName(jettonName);
            const fromWalletId = await getWalletIdByUserId(ctx.from.id, jettonId);
            const toWalletId = await getWalletIdByUserId(ctx.message.reply_to_message?.from?.id, jettonId);
            await transferCommand(ctx, fromWalletId, toWalletId, jettonId, amount);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Ошибка: ${error.message}`);
            } else {
                console.error('Произошла ошибка, но она не типа Error');
            }
        }
    } else {
        // ctx.reply("Пожалуйста, отправьте сообщение в формате 'количество название_жетона'. Пример: '20 BTC'");
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
    jetton_id: number,
    amount: number
): Promise<any> => {
    // Транзакция для создания записей о переводе жетонов
    const transaction = await prisma.$transaction(async (prisma) => {
        return await prisma.balance_ledger.create({
            data: {
                wallet_id_from: fromWalletId,
                wallet_id_to: toWalletId,
                jetton_id: jetton_id,
                value: amount,
                created_at: new Date()
            }
        });
    });

    return transaction;
};
