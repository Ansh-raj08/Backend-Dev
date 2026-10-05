import express from "express";
const app = express() 

const port = 6969

import morgan from "morgan";
app.use(morgan('dev'))
app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))



function middleware1(req,res,next){
    console.log('this is middleware first')

    next()

}


function loggerMiddleware(req,res,next){
    console.log(req.method)
    console.log(req.url)
    console.log(res.statusCode)

    next()
}

app.use(middleware1)

app.get('/health', (req, res) => {
    res.json({
        message: 'Class7 server is running',
        endpoints: {
            user: 'POST /user',
            about: 'POST /about'
        }
    })
})

app.post('/user', loggerMiddleware, (req,res)=>{
    
    console.log('this is main logic....')

    console.log(req.body)

    res.json({
        message: 'User request received',
        data: req.body
    })
})







app.post('/about', (req,res)=>{

        console.log('this is about logic')

        res.send('<h1>this is about logic...</h1>')
})


app.listen(port, ()=>{
    console.log('server has started at port : ', port)
})