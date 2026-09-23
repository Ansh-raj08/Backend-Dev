import express from "express"
const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))
const port = 6969

app.use(express.static('public'))

app.post('/user',(req,res) => {
    console.log("body")

    console.log(req.body)
    res.status(200).json({
        message : "Data recived successfully",
        success : true,
        status : 200
    })
})


app.listen(port , () =>{
    console.log(`server is running on port ${port}`)
})