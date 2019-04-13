const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, '/')))

app.use('/dark', (req, res) => res.sendFile(path.join(__dirname, '/index-dark.html')))
app.use('/light', (req, res) => res.sendFile(path.join(__dirname, '/index-light.html')))

app.use('*', (req, res) => res.redirect('/light'))

app.listen(process.env.PORT || 3000)
console.log(`App running at port ${process.env.PORT || 3000}`)
