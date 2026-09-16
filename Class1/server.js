import math from './math.js'
// console.log(math.sum(99, 101))
// console.log(math.divide(4,2))

// console.log(os.uptime)

// import fs from "node:fs";

// fs.mkdir('./child',(err)=>{
//     if (err){
//         console.log(err);
//     }
//     else{
//         console.log("folder created");
//     }
// })

// do all the fs module examples at home

import dns from 'dns'

// dns.lookup('google.com',(err, address)=>{
//     if (err){
//         console.log(err)
//         return
//     }
//     else{
//         console.log(address)
//     }
// })

// dns.reverse(' 157.240.208.174',(err, domain)=>{
//     if (err){
//         console.log(err)
//         return
//     }
//     else{
//         console.log(domain)
//     }
// })

import crypto from "crypto"

let password = '123456'

let hashpassword = crypto.createHash('sha256').update(password).digest('hex')

console.log(hashpassword)

console.log(crypto.randomUUID())