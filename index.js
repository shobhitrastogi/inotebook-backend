const express = require("express")
const app = express();
const connectToMongo = require("./db/db");
connectToMongo();
var cors= require('cors')
const corsOptions = {
    origin: 'https://main--inquisitive-cajeta-8a1913.netlify.app/signup', // replace with your frontend domain
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };
  app.use(cors(corsOptions));
const path  =require('path')
app.use(express.json())
const dotenv = require('dotenv'); 
dotenv.config()
 const port = process.env.PORT || 5000; 
 const baseUrl = process.env.BASE_URL || 'http://localhost:'; 
//  static files
app.use(express.static(path.join(__dirname,'../inotebook/build')))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../inotebook/build/index.html'))
})
//  Available Routes
app.use(`${baseUrl}/api/auth`,require("./routes/auth"))
app.use(`${baseUrl}/api/notes`,require("./routes/notes"))
app.listen(port,()=>{
    try {
        console.log(`app are listen on${baseUrl}:${port}`);
    } catch (error) {
        console.log(`app not listen on port no ${port} `)
    }
})