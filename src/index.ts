import {Bot, Context} from 'grammy';
import {handleMessage} from '~/chat';
import { ignoreOld, sequentialize } from "grammy-middlewares";
import { autoRetry } from "@grammyjs/auto-retry";
import { limit } from "@grammyjs/ratelimiter";
import process from "node:process";

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const logsChatId = process.env.LOGS_CHAT_ID ?? null;

if (!token) {
    throw new Error('Declare BOT_TOKEN in .env file in the root of the project');
}

const bot = new Bot(token);

bot.api.setMyCommands([
    { command: 'map', description: 'Карта Лисьей Деревни' },
]);

bot.api.config.use(autoRetry({
    maxRetryAttempts: 3, // only repeat requests once
    maxDelaySeconds: 5, // fail immediately if we have to wait >5 seconds
}));
bot.use(
    ignoreOld(),
    limit(),
    sequentialize(),
);

const LottonyLinksList = {
        //Lottony DAO
        site_dao: 'https://dao.lottony.win/',
        lottony_dao: 'https://t.me/lottony_dao',
        lottony_chat: 'https://t.me/lottony_chat',
        lottony_dao_decisions: 'https://t.me/lottony_dao_decisions',
        lottony_art: 'https://t.me/lottony_art',
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
            `- [Летопись решений Совета Мудрейших](${LottonyLinksList.lottony_dao_decisions})\n` +
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
        bot.command("map", async (ctx: Context) => {
            await ctx.reply(mapMessage, {
                parse_mode: "Markdown",
                link_preview_options: { is_disabled: true },
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
            .catch(async (e: Error) => {
                await ctx.reply(e.message)
            });
    }
});

bot.catch(async (err) => {
    console.error('bot.catch: An error occurred\n', err);
    logsChatId && await err.ctx.api.sendMessage(logsChatId,
        `An error occurred: ${err.message} 
        in chat ${err.ctx.chat?.id} 
        with ${err.ctx.from?.id} (${err.ctx.from?.username})`
    );
})

bot.start()
    .catch((err) => {
        console.log('Start failed', err);
    });
