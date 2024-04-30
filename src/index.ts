import {Bot, Context} from 'grammy';
import {handleMessage} from '~/chat';

require('dotenv').config();

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

bot.api.setMyCommands([
    { command: 'map', description: 'Карта Лисьей Деревни' },
]);

const LottonyLinksList = {
        //Lottony DAO
        site_dao: 'https://dao.lottony.win/',
        lottony_dao: 'http://t.me/lottony_dao',
        lottony_chat: 'http://t.me/lottony_chat',
        lottony_art: 'http://t.me/lottony_art',
        lottony_feed: 'https://t.me/lottony_feed',
        lottony_legends: 'https://t.me/lottony_legends',
        lottony_hate: 'https://t.me/lottony_hate',
        //BlogerLis
        blogerLis: 'https://t.me/blogerLis',
        BLYoutube: 'https://www.youtube.com/@blogerLis',
        BLTikTok: 'https://www.tiktok.com/@user6068745739883',
        BLInstagram: 'https://www.instagram.com/gfdsjkb/',
        //Lottony
        site_lottony: 'https://lottony.win/',
        bot_lottony: 'https://t.me/lottony_bot',
        channel_lottony: 'http://t.me/lottony',
    },
    mapMessage = `Карту пока не нарисовали, так что держи список!\n\n` +
        `Lottony DAO:\n` +
            `- [Сайт](${LottonyLinksList.site_dao})\n` +
            `- [Канал](${LottonyLinksList.lottony_dao})\n` +
            `- [Чат](${LottonyLinksList.lottony_chat})\n` +
            `- [Картинная галерея](${LottonyLinksList.lottony_art})\n` +
            `- [Книга легенд](${LottonyLinksList.lottony_legends})\n` +
            `- [Новостная лента](${LottonyLinksList.lottony_feed})\n` +
            `- [Клуб Бубликов](${LottonyLinksList.lottony_hate})\n` +
        `\n` +
        `Lottony:\n` +
            `- [Сайт](${LottonyLinksList.site_lottony})\n` +
            `- [Канал](${LottonyLinksList.channel_lottony})\n` +
            `- [Лотерея](${LottonyLinksList.bot_lottony})\n` +
        `\n` +
        `Уголок Блогера Лиса:\n` +
            `- [Канал](${LottonyLinksList.blogerLis})\n` +
            `- [Youtube](${LottonyLinksList.BLYoutube})\n` +
            `- [TikTok](${LottonyLinksList.BLTikTok})\n` +
            `- [Instagram](${LottonyLinksList.BLInstagram})\n`;
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
        return handleMessage(ctx)
            .catch((e: Error) => {
                ctx.reply(e.message)
            });
    }
});

bot.start();
