const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./Routes/userRoute');
const PORT = 5000

const app = express()
app.use(bodyParser.json())

app.use(cors({origin:'http://localhost:5173'}))
app.use('/api',router)

app.listen(PORT, ()=>{
    console.log("Server is Running in the PORT " + PORT);
})