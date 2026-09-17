import express from 'express'
const app = express()

app.use(express.json())

const port = 3002

app.get('/user', (req, res) => {
    res.json({
        message: "APi Calling"
    })
})

app.post('/user', (req, res) => {
    console.log(req)
    console.log(req.body.name)
    console.log(req.method)
    console.log(req.url)
    console.log(req.body)
    console.log(req.headers)
    res.json({
        message: "Data received"
    })
})
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})