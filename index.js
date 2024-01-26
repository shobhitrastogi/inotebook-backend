const express = require("express")
const app = express();
const connectToMongo = require("./db/db");
connectToMongo();
const dotenv = require('dotenv');
dotenv.config();
var cors= require('cors')
app.use(cors())
const path  =require('path')
app.use(express.json())
 const port =process.env.PORT || 5000; 
//  static files
app.use(express.static(path.join(__dirname,'../inotebook/build')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../inotebook/build/index.html'))
})
//  Available Routes
app.use('/api/auth',require("./routes/auth"))
app.use('/api/notes',require("./routes/notes"))
app.listen(port,()=>{
    try {
        console.log(`app are listen on http://localhost:${port}`)
    } catch (error) {
        console.log(`app not listen on port no ${port} `)
    }
})