const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const { Client } = require('pg')

app.post('/login', (req, res) => {
    const Data = req.body;

    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    client.query(`SELECT * FROM Users WHERE Username=$1`, [Data.Username]).then(
        result => {
            console.log(result.rows[0] == null)
            if (result.rows[0] == null){
                res.json({res: false})
            } else if (result.rows[0].password == Data.Password) {
                res.json({res: true})
            } else{
                res.json({res: false})
            }
        }
    ).catch(
        err => {
            console.log(err)
            res.json({res: false})
        }
    )
})


app.listen(3001);