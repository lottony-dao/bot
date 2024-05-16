import { account } from '@prisma/client';

export const getUserName = (account: account): string => {
    return account.username[0] || account.name || `#${account.tg_id}`;
}
