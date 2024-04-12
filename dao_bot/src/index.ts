import {Bot, Context} from 'grammy';
import {handleMessage} from '~/chat';
import { checkUserActivity } from './chat/public/checkUserActivity';

require('dotenv').config();

const chat_id = process.env.MAIN_CHAT_ID;
const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

bot.on('message', async (ctx: Context) => {
    let chat = ctx.chat || null;

    if (!chat) {
        return;
    }
    if (chat.type === 'private') {
        if (ctx.message?.text) {

        }
    } else if (chat_id && (chat.id.toString() === chat_id)) {
        const activityCheck = await checkUserActivity(ctx);
        if (!activityCheck) {
            handleMessage(ctx);
        }else{
            const username = ctx.from?.username || ctx.from?.first_name || ctx.from?.id;
            ctx.reply(`${username} - не надо жульничать, сегодня ты уже баловался этим.`);
        }
    }
});

bot.start();
