import {Bot, Context} from 'grammy';
import {handleMessage} from '~/chat';

require('dotenv').config();

const chat_id = process.env.MAIN_CHAT_ID;
const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

bot.on('message', (ctx: Context) => {
    let chat = ctx.chat || null;

    if (!chat) {
        return;
    }
    if (chat.type === 'private') {
        if (ctx.message?.text) {

        }
    } else {
        chat_id && (chat.id.toString() === chat_id) && handleMessage(ctx);
    }
});

bot.start();
