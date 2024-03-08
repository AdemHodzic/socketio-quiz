import express from 'express'

import authRouter from "./auth/router";

const app = express()

app.use(express.json())

app.use('/auth', authRouter);

app.get('/healthz', (req, res) => {
    return res.json("I'm alive!")
})



export default app;

