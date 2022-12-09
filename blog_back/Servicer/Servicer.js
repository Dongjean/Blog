const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

async function AddUser(Data) {
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    await client.query(`INSERT INTO Users VALUES($1, $2, $3)`, [Data.NUsername, Data.NPassword, Data.NDisplay])

    client.end();
}

async function AddPost(Title, PostText, ImageName, ImageDir, AuthorUsername) {
    var PostID = 1;
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT PostID FROM BlogPost ORDER BY PostID ASC`)
        result.rows.forEach((ID) => {
            if (PostID == ID.postid) {
                PostID++;
            }
        })
    } catch(err) {
        console.log(err)
    }
    //console.log(PostID)
    await client.query(`INSERT INTO BlogPost VALUES($1, $2, $3, $4, $5, $6)`, [PostID, Title, PostText, ImageName, ImageDir, AuthorUsername])

    client.end();
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

async function PostBlogServicer (Data, Image) {
    var ImageDir;

    //get extension of the image file
    var extension;
    for (var i = Image.name.length - 1; i >= 0; i--) {
        if (Image.name[i] == '.') {
            extension = Image.name.slice(i)
            break
        }
    }

    //get directory of folder where image is to be stored
    const FileDir = path.join(__dirname, '../Images')
    //get a unique file name and store the image as that name in server
    try{
        const files = await fs.promises.readdir(FileDir)
        var name = 1;
        files.forEach(function (file) {
            var filename;
            var fileextension;
            for (var i=file.length-1; i>=0; i--) {
                if (file[i] == '.') {
                    fileextension = file.slice(i)
                    filename = parseInt(file.slice(0, i))
                }
            }
            if(extension == fileextension) {
                if (name <= filename) {
                    name = filename + 1;
                }
            }
        });
    
        //new unique file name
        const newIMGname = name + extension
    
        //save the file in server
        Image.mv(`./Images/${newIMGname}`)
    
        //get directory of the file to be saved in DB for future use
        ImageDir = path.join(__dirname, `../Images/${newIMGname}`)
    } catch(err) {
        console.log(err)
    }
    
    //getting details about the blog post
    const Title = Data.Title
    const PostText = Data.PostText
    const AuthorUsername = Data.AuthorUsername;
    const ImageName = Image.name

    AddPost(Title, PostText, ImageName, ImageDir, AuthorUsername);
    
    return {res: 'success!'}
}

async function GetAllBlogs() {
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    var Posts = [];
    try{
        const result = await client.query(`SELECT *  FROM BlogPost`)
        if (result.rows.length == 0) {
            client.end();
            return {res: null}
        }
        Image = await fs.promises.readFile(result.rows[0].imgdir)
        for (var i=0; i<result.rows.length; i++) {
            row = result.rows[i]
            ImageBuffer = await fs.promises.readFile(row.imgdir)
            Posts[i] = {PostID: row.postid, Title: row.title, PostText: row.posttext, ImageName: row.imgname, Image: ImageBuffer.toString('base64'), Username: row.username}
        }
    } finally{
        client.end();
    }
    return {res: Posts}
}

module.exports = { LoginServicer, SignupServicer, PostBlogServicer, GetAllBlogs };