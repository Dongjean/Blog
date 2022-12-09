const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

const Servicer = require('../Servicer/Servicer.js')

router.post('/login', (req, res) => {
    const Data = req.body;
    Servicer.LoginServicer(Data).then(response => res.json(response))
})

router.post('/signup', (req, res) => {
    const Data = req.body;
    Servicer.SignupServicer(Data).then(response => res.json(response))
})

router.post('/postblog', fileUpload({createParentPath: true}), (req, res) => {
    const Image = req.files['Image'];
    const Data = req.body;
    Servicer.PostBlogServicer(Data, Image).then(response => res.json(response))
})

router.get('/allblogs', (req, res) => {
    console.log('hi')
    Servicer.GetAllBlogs().then(response => res.json(response))
})

module.exports = router;