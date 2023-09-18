require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const ShortUrl = require("./models/shortUrl")
const app = express()

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 5000


app.get('/',async (req,res)=>{
    const ShortUrls = await ShortUrl.find()
    res.render('index',{ShortUrls:ShortUrls});
})

app.post('/shortUrls',async(req,res)=>{
    await ShortUrl.create({full:req.body.fullUrl})
    res.redirect('/')
})

mongoose.connect(MONGO_URL)
.then(
    ()=>{
        console.log("Connected to MongoDB Atlas Database");
        app.listen(PORT,()=>{
            console.log("Node API app is running on port 3000")
        })
    }
)

app.get('/:shortUrl',async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++;
    shortUrl.save();
    
    res.redirect(shortUrl.full)
})

