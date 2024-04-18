import { Bot, Context, GrammyError, HttpError } from 'grammy';
import { handleMessage } from '~/chat';
import { checkUserActivity } from './chat/public/checkUserActivity';
import * as process from "node:process";

require('dotenv').config();

const chat_id = process.env.MAIN_CHAT_ID;
const token = process.env.BOT_TOKEN;
const defaultRetryLimit = 1;
const retry_limit = parseInt(process.env.RETRY_LIMIT || '', 10) || defaultRetryLimit;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

async function sendMessageWithRetry(ctx: Context, text: string, retryLimit: number = retry_limit) {
    let attempt = 0;
    while (attempt < retryLimit) {
        try {
            await ctx.reply(text);
            return;
        } catch (error) {
            attempt++;
            if (error instanceof GrammyError && error.error_code === 429) {
                const delay = error.parameters?.retry_after ? error.parameters.retry_after * 1000 : 1000;
                console.log(`Attempt ${attempt}: Too many requests, retrying after ${delay} ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`Attempt ${attempt}: Failed to send message:`, error);
                if (attempt >= retryLimit) {
                    console.log("Max retry attempts reached, giving up.");
                    throw new Error("Failed to send message after retries.");
                }
            }
        }
    }
}

bot.on('message', async (ctx: Context) => {
    try {
        let chat = ctx.chat || null;
        if (!chat) return;

        if (chat.type === 'private' && ctx.message?.text) {
            // Обработка личных сообщений
        } else if (chat_id && chat.id.toString() === chat_id) {
            const activityCheck = await checkUserActivity(ctx);
            if (!activityCheck) {
                handleMessage(ctx);
            } else {
                const username = ctx.from?.username || ctx.from?.first_name || ctx.from?.id;
                try {
                    await sendMessageWithRetry(ctx, `${username} - не надо жульничать, сегодня ты уже баловался этим.`);
                } catch (retryError) {
                    console.error("Error after all retries:", retryError);
                }
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

bot.start();
