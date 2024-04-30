import {Context} from "grammy";
import {ratingMessage} from "~/repositories/ratingRepository"

export const messageFunctionMap: {[k: string]: (ctx: Context) => Promise<void>} = {
    '+rep': ratingMessage,
    '+реп': ratingMessage,
    '-rep': ratingMessage,
    '-реп': ratingMessage,
    '?rep': ratingMessage,
    '?реп': ratingMessage,
    '?profile': ratingMessage,
    '?профиль': ratingMessage,
}
