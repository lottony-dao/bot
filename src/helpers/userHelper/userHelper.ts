import { user } from '@prisma/client';

export const getUserName = (user: user): string => {
    return user.username[0] || user.name || `#${user.tg_id}`;
}
