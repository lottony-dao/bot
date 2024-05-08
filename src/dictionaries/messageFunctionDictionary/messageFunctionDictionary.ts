import {Context} from "grammy";
import {ratingMessage} from "~/repositories/ratingRepository"
import {parseTransfer} from "~/services/balanceService"

export const messageFunctionMap: {[k: string]: (ctx: Context) => Promise<void>} = {
    '+rep': ratingMessage,
    '+реп': ratingMessage,
    '-rep': ratingMessage,
    '-реп': ratingMessage,
    '?rep': ratingMessage,
    '?реп': ratingMessage,
    '?profile': ratingMessage,
    '?профиль': ratingMessage,
    'transfer (.*)': parseTransfer,
}
