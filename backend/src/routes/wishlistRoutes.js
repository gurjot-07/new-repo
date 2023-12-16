

const express = require('express');
const {togglevisibility,createWishlist ,getUserBooklists,updateBooklist,getpublicbooklists,addreview,getreviews} = require('../controllers/WishlistController');
const wishlistRouter = express.Router();

    
wishlistRouter.post("/create", createWishlist);    
wishlistRouter.get("/getuserbooklists/:userId", getUserBooklists); 
wishlistRouter.get("/getpublicbooklists", getpublicbooklists); 
wishlistRouter.post('/update/:booklistId', updateBooklist);                       
wishlistRouter.post('/addreview', addreview); 
wishlistRouter.get("/getreviews/:booklistId", getreviews);
wishlistRouter.post('/togglevisibility/:reviewId', togglevisibility); 

module.exports = wishlistRouter;