require('dotenv').config()

const express = require('express')
const cors = require('cors')  //for development use only


const app = express()

app.use(express.json({limit: '20mb'}))
app.use(cors())

require('./database/dbConnect').connect()
require("./database/blobStore").config()

app.use("/", express.static('public'))


//routes

//


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server is running at port', PORT))