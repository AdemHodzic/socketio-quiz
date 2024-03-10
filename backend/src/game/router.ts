import { Router } from 'express';

import { createMatch, joinMatch, leaveMatch, getResults } from './handlers';

import { validToken } from '../auth/middleware';

const router = Router();

router.get('/results/:matchId', validToken, getResults);
router.post('/create', validToken, createMatch);
router.post('/join', validToken, joinMatch);
router.post('/leave/:matchId', validToken, leaveMatch);

export default router;