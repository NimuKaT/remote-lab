const express = require('express')
// import express, { Express } from "express"
let app = express()
let port = 3000

express.static("app/build")
app.use(express.static('app/build'))
// app.get('/', (req, res) => {
//     res.sendFile
// })

app.listen(port, () => {
    console.log('Server listening to ' + port)
})