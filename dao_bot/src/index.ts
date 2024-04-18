import {Bot, Context} from 'grammy';
import {handleMessage} from '~/chat';

require('dotenv').config();

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

bot.command("map", async(ctx: Context) =>{
    await ctx.reply("Вот ссылки на .....");

});

bot.on('message', async (ctx: Context) => {
    let chat = ctx.chat || null;

    if (!chat) {
        return;
    }
    if (chat.type === 'private') {
        if (ctx.message?.text) {

        }
    } else {
        return handleMessage(ctx);
    }
});

bot.start();
