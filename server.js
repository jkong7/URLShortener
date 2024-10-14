const express = require('express')
const app = express() 
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrls')

mongoose.connect('mongodb://localhost/urlShortener').then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req,res)=>{
    await ShortUrl.create({ full: req.body.fullurl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res)=> {
   const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
   if (shortUrl==null) {return res.sendStatus(404)}
   shortUrl.clicks++
   shortUrl.save()
   res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5900); 

//We are using ejs to dynamically render html 

//Mongo db schema for a ShortUrl: Full url, short url, and number of clicks
//short url is generated using short id library (shortid.generate)

//Index route is a get route that renders index page with finding EVERY row
//in the table and then passing that to the index to render 

//"Shrink" button needs to be a post (create new row entry with the input) of
//the input box which is the full url, short url and clicks are default set up

//Lastly, we need get route for accessing the short url, we get based on the ShortURL
//parameter passed in (we get the row), then increment clicks, save and then redirect
//to the full url webpage 