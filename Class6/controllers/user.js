import fs from 'fs'

const getuser = (req, res) => {
    let data = fs.readFileSync('./database/database.json', 'utf-8')

    data = JSON.parse(data)

    res.status(200).json({
        message: 'data fetched successfully..',
        success: true,
        data

    })
}



const createuser = (req, res) => {
    console.log('first')

    let { name, age, id } = req.body



    // let name = req.body.name
    // let age = req.body.age
    // let id = req.body.id

    if (!name || !age || !id) {
        return res.status(404).json({
            message: "data has not found",
            success: false
        })
    }
    let data = fs.readFileSync('./database/database.json', 'utf-8')

    data = JSON.parse(data)

    data.push({ name, age, id })

    fs.writeFileSync('./database/database.json', JSON.stringify(data, null, 3))

    res.status(200).json({
        message: 'data created successfully...',
        success: true,
        data
    })
}


const updateuser = (req, res) => {



    const id = Number(req.params.id ?? req.body.id)

    let { name, age } = req.body

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: 'a valid user id is required',
            success: false
        })
    }


    let data = fs.readFileSync('./database/database.json', 'utf-8')

    data = JSON.parse(data)


    // let index = data.findIndex((e)=>e.id == id)

    let user = data.find((entry) => entry.id === id)

    if (!user) {
        return res.status(404).json({
            message: 'user not found',
            success: false
        })
    }

    if (name !== undefined) user.name = name
    if (age !== undefined) user.age = age

    fs.writeFileSync('./database/database.json', JSON.stringify(data, null, 3))

    res.status(200).json({
        message: 'data updated successfully...',
        success: true,
        data
    })
}

const deleteuser = (req, res) => {
    const id = Number(req.params.id);
    const filePath = './database/database.json';

    let data = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(data);

    const userIndex = data.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: 'user not found',
            success: false
        });
    }

    data.splice(userIndex, 1);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    res.status(200).json({
        message: 'user deleted successfully',
        success: true
    });
};



export { getuser, createuser, updateuser,deleteuser }