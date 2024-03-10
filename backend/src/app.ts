import express from 'express'

import cors from 'cors'

import authRouter from "./auth/router";
import gameRouter from "./game/router";
import adminRouter from "./admin/router";

const app = express()

app.use(express.json())
app.use(cors())

app.use('/auth', authRouter);
app.use('/game', gameRouter);
app.use('/admin', adminRouter);

app.get('/healthz', (req, res) => {
    return res.json("I'm alive!")
})



export default app;

