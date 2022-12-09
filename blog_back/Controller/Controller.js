const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

const Servicer = require('../Servicer/Servicer.js')

//All the Routes

router.post('/login', (req, res) => {
    const Data = req.body; //get the data in the body of the post request
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

router.get('/allblogs', (req, res) => {
    Servicer.GetAllBlogs().then(response => res.json(response)) //call the Service layer for a reponse, and respond with this response
})

router.post('/deleteblog', (req, res) => {
    const Data = req.body;
    Servicer.DeleteBlogServicer(Data).then(response => res.json(response))
})

module.exports = router;