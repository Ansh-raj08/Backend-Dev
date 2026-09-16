import fs from 'fs'

const getuser = (req,res) => {
    let data = fs.readFileSync('./database/data.json','utf-8')

    data = JSON.parse(data)

    res.status(200).json
}

const createuser = (req, res) => {
    let ( name, Agent, id ) = req.body
}