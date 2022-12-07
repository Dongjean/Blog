const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const { Client } = require('pg')

function AddUser(Data) {
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    client.query(`INSERT INTO Users VALUES($1, $2, $3)`, [Data.NUsername, Data.NPassword, Data.NDisplay])
}

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
            if (result.rows[0] == null){
                res.json({res: false})
            } else if (result.rows[0].password == Data.Password) {
                res.json({res: true, Display: result.rows[0].displayname})
            } else {
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

app.post('/signup', (req, res) => {
    const Data = req.body;

    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    client.query(`SELECT * FROM Users WHERE Username=$1`, [Data.NUsername]).then(
        result => {
            if (result.rows[0] !== undefined){
                res.json({res: false})
            } else {
                if (Data.isPWValid) {
                    AddUser(Data)
                }
                res.json({res: true})
            }
        }
    )
})


app.listen(3001);