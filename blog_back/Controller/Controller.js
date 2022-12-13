const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

const Servicer = require('../Servicer/Servicer.js')

//All the Routes

router.get('/login/:Username/:Password', (req, res) => {
    const Data = req.params; //get the data in the parameters
    Servicer.LoginServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/signup', (req, res) => {
    const Data = req.body; //get the data in the body of the post request
    Servicer.SignupServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/postblog', fileUpload({createParentPath: true}) /*use the middleware for file upload just for this route*/, (req, res) => {
    const Image = req.files['Image']; //get the information of the Image
    const Data = req.body; //get the rest of the data
    Servicer.PostBlogServicer(Data, Image).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.get('/getblogs/:Cats', (req, res) => {
    const Data = req.params;
    Servicer.GetBlogs(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/deleteblog', (req, res) => {
    const Data = req.body;
    Servicer.DeleteBlogServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.get('/getcomments/:PostID', (req, res) => {
    const Data = req.params
    Servicer.GetCommentsServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/addcomment', (req, res) => {
    const Data = req.body;
    Servicer.AddCommentServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/deletecomment', (req, res) => {
    const Data = req.body;
    Servicer.DeleteCommentServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.get('/getlikescount/:PostID', (req, res) => {
    const Data = req.params;
    Servicer.GetLikesCountServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.get('/getlikestate/:PostID/:CurrUser', (req, res) => {
    const Data = req.params;
    Servicer.GetLikedStateServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/addlike', (req, res) => {
    const Data = req.body;
    Servicer.AddLikeServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/removelike', (req, res) => {
    const Data = req.body;
    Servicer.RemoveLikeServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.get('/getallcats', (req, res) => {
    Servicer.GetAllCatsServicer().then(response => res.json(response)) //call the Service layer for a reponse, and respond with this response
})

router.post('/addcategory', (req, res) => {
    const Data = req.body;
    Servicer.AddCategoryServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.get('/getcategories/:PostID', (req, res) => {
    const Data = req.params;
    Servicer.GetCategoriesServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/updateblog', fileUpload({createParentPath: true}) /*use the middleware for file upload just for this route*/, (req, res) => {
    const Image = req.files['Image']; //get the information of the Image
    const Data = req.body; //get the rest of the data
    Servicer.UpdateBlogServicer(Data, Image).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

module.exports = router;