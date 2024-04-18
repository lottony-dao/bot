import { user } from '@prisma/client';

export const getUserName = (user: user): string => {
    return user.nickname || user.name || `#${user.tg_id}`;
}