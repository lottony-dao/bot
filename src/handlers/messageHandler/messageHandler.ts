import {Context} from "grammy";
import {userProfile} from "~/repositories/profileRepository";
import {messageFunctionMap} from "~/dictionaries/messageFunctionDictionary"

function defaultAnswer(ctx: Context) {
    let id = ctx.message?.from.id || 0,
        text = personalRepliesMap[id] || '',
        max = 1000,
        min = 1,
        rand = Math.floor(
            Math.random() * (max - min + 1) + min
        );

    if (rand === 69 && text) {
        if (ctx.message?.message_id) {
            ctx.reply(text, {
                reply_parameters: {message_id: ctx.message?.message_id},
            });
        } else {
            ctx.reply(text);
        }
    }
}

const personalRepliesMap: { [key: number]: string } = {
    0: "But... How? 😨",
    5698437506: "Fucking legend 🥶",
};

export const message = async (ctx: Context) => {
    const msg = ctx.message?.text || '';
    const targetTelegramUser = ctx.message?.reply_to_message?.from;
    if(targetTelegramUser?.is_bot){
        return;
    }

    await messageFunctionMap[msg.toLowerCase().trim()](ctx);

    switch (msg.toLowerCase().trim()) {
        case "?profile":
        case "?профиль":
            await userProfile(ctx);
            break;

        default:
            defaultAnswer(ctx);
    }
};

