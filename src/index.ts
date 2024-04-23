import {Bot, Context} from 'grammy';
import {message} from '~/handlers/messageHandler';
import {mapMessage} from "~/handlers/mapHandler";

require('dotenv').config();

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

bot.api.setMyCommands([
    {command: 'map', description: 'Карта Лисьей Деревни'},
]);

bot.command("map", (ctx: Context) => {
    ctx.reply(mapMessage, {
        parse_mode: "Markdown",
        link_preview_options: {is_disabled: true},
    });
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
        return message(ctx)
            .catch((e: Error) => {
                ctx.reply(e.message)
            });
    }
});

bot.start();
