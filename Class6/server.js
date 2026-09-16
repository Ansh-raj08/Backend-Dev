import express from 'express'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(express.json())
app.use('/', userRoutes)

const port = 3002;

app.listen(port,()=>{
    console.log("server has started at port",port)
})