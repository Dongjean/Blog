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

async function LoginServicer (Data) {
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT * FROM Users WHERE Username=$1`, [Data.Username])
        if (result.rows[0] == null){
            return {res: false}
        } else if (result.rows[0].password == Data.Password) {
            return {res: true, Display: result.rows[0].displayname}
        } else {
            return {res: false}
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
}

async function SignupServicer (Data) {
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT * FROM Users WHERE Username=$1`, [Data.NUsername])
        if (result.rows[0] !== undefined){
            return {res: false}
        } else {
            if (Data.isPWValid) {
                AddUser(Data)
            }
            return {res: true}
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
}

module.exports = { LoginServicer, SignupServicer };