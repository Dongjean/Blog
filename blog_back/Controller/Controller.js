const express = require("express");
const router = express.Router();

const Servicer = require('../Servicer/Servicer.js')

router.post('/login', (req, res) => {
    const Data = req.body;
    Servicer.LoginServicer(Data).then(response => res.json(response))
    //res.json(Servicer.LoginServicer(Data));
})

router.post('/signup', (req, res) => {
    const Data = req.body;
    Servicer.SignupServicer(Data).then(response => res.json(response))
})

module.exports = router;