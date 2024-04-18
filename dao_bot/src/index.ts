import { Bot, Context, GrammyError, HttpError } from 'grammy';
import { handleMessage } from '~/chat';
import { checkUserActivity } from './chat/public/checkUserActivity';

require('dotenv').config();

const chat_id = process.env.MAIN_CHAT_ID;
const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

async function sendMessageWithRetry(ctx: Context, text: string, retryLimit: number = 10) {
    for (let i = 0; i < retryLimit; i++) {
        try {
            await ctx.reply(text);
            break; // Успешная отправка, выходим из цикла
        } catch (error) {
            if (error instanceof GrammyError && error.error_code === 429) {
                const delay = error.parameters?.retry_after ? error.parameters.retry_after * 1000 : 1000; // Используйте значение по умолчанию, если retry_after не задан
                console.log(`Too many requests, retrying after ${delay} ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Failed to send message:', error);
                throw error;
            }
        }
    }
}

bot.on('message', async (ctx: Context) => {
    let chat = ctx.chat || null;

    if (!chat) {
        return;
    }
    if (chat.type === 'private') {
        if (ctx.message?.text) {
            // Обработка личных сообщений здесь, если требуется
        }
    } else if (chat_id && (chat.id.toString() === chat_id)) {
        const activityCheck = await checkUserActivity(ctx);
        if (!activityCheck) {
            handleMessage(ctx);
        } else {
            const username = ctx.from?.username || ctx.from?.first_name || ctx.from?.id;
            // Прямая отправка сообщения без использования очереди
            await sendMessageWithRetry(ctx, `${username} - не надо жульничать, сегодня ты уже баловался этим.`);
        }
    }
});

bot.start();
