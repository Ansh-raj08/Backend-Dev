import http from 'http'

const server = http.createServer((req,res)=>{

    if (req.url === '/' && req.method === 'GET'){
        res.end('<h1>welcome to backend development</h1>')
    }

    else if (req.url === '/about' && req.method === 'GET'){
        res.end('<h1>this is about page</h1>')
    }

    else if (req.url === '/contact' && req.method === 'GET'){
        res.end('<h1>this is contact page</h1>')
    }

    else if (req.url === '/home' && req.method === 'GET'){
        res.end('<h1>this is home page</h1>')
    }

})

const port = 3000

server.listen(port, ()=>{
    console.log('Sever has created at the port', port)
})

