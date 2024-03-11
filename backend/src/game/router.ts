import { Router } from 'express';

import { joinMatch, getResults } from './handlers';

import { validToken } from '../auth/middleware';

const router = Router();



router.get('/results/:matchId', validToken, getResults);
router.post('/join', validToken, joinMatch);

export default router;