import { env } from "node:process"
import NIUSBDRiver from "./NIUSBDriver"
import express from 'express'
import readline from "readline"
import fs from "fs/promises"

// const express = require('express')
// import express, { Express } from "express"
let app = express()
let port = 3000
let niusb = new NIUSBDRiver('/')

express.static("app/build")
app.use(express.static('app/build'))
// app.get('/', (req, res) => {
//     res.sendFile
// })

app.get('/api/testWrite', (req, res) => {
    niusb.writeToDevice({digital: [
        [false, false, true, true, false,false,true, true],
        [true,false,false,false,false,false,false,false]
    ], analogue: [[false,false]]}, () => {

    })
    res.send("Hello")
})

app.get('/api/currentLab', (req, res, next) => {
    res.json({
        "labFile": labFile
    })
})

// Select Lab file

let specificationDir = "./bin/dist/Specifications/"
let labFile = ""
let rl = readline.createInterface({input: process.stdin, output: process.stdout})
function getLabFile() {
    rl.question("Please enter the file name of the lab file to be opened: ", (answer) => {
        fs.readFile(specificationDir + answer, 'utf-8').then((data) => {
            // read JSON
            console.log(JSON.parse(data))
            labFile = answer
        }).catch((err) => {
            // Handle error
            console.log(err)
            getLabFile()
        })
    })
}

app.listen(port, () => {
    console.log('Server listening to ' + port)
})

getLabFile()