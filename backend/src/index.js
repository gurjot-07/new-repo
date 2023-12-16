const PORT = 4000;
const express = require("express");
const app = express();                                      
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoutes");
const stripeRouter = require("./routes/stripeRoutes");
const authRouter = require("./routes/authRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const passport = require('./middlewares/passport-config');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

require('dotenv').config();




// Middleware to initialize Passport
app.use(session({ secret: 'A8lgwryZ7jg0MFHvslXOJHQqA2GE', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors());

app.use(express.json());       //middleware1 - converts request body ( stream type) to String 


//declare routes here
app.use("/users",userRouter);
app.use("/cart",cartRouter);
app.use("/stripe",stripeRouter);
app.use("/auth",authRouter);
app.use("/wishlist",wishlistRouter);

app.get("/",(req,res)=>{
    res.send("Home");
})

//console.log(`${process.env.HOST_URL}:${process.env.PORT}`);

//mongodb connection
mongoose.connect(`mongodb+srv://admin:MongoDB@iacondb.euiq2v7.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(PORT || 4000,()=>{
        console.log(`server started and listening at port 4000`);
    });
})
.catch((error)=>{
    console.log(error);
});



