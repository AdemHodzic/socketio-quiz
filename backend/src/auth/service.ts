import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../constants';

export const validateToken = (token: string) => {
    try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
    }
    catch (error) {
        return null;
    }
}