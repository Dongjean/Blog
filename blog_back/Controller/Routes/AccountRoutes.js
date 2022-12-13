const express = require("express");
const router = express.Router();

const Servicer = require('../../Servicer/Servicer.js')

router.get('/login/:Username/:Password', (req, res) => {
    const Data = req.params; //get the data in the parameters
    Servicer.LoginServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

router.post('/signup', (req, res) => {
    const Data = req.body; //get the data in the body of the post request
    Servicer.SignupServicer(Data).then(response => res.json(response)) //pass all the received data into the Service layer to be processed and then respond with the returned response
})

module.exports = router;