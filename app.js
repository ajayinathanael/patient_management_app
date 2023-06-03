
const express = require("express");
const userRouter = require('./routes/userRoutes');
const methodOverride = require("method-override");

const app =express();

app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://cdn.jsdelivr.net; style-src 'self' https://stackpath.bootstrapcdn.com  https://cdn.jsdelivr.net; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self'; frame-src 'self'"
    );
     
    next();
  });

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


app.set('view engine', 'ejs');
app.use(express.static('public'));

// 3) ROUTES
app.use('/', userRouter);

//invalid route
app.all('*',(req,res)=>{
    // next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
    res.status(400).json(`Unknown address ${req.originalUrl}`);
});
 

module.exports = app; 