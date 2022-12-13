const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

//for adding a user
async function AddUser(Data) {

    //connect to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();
    
    try {
        //Insert the data on the new User into DB
        await client.query(`INSERT INTO Users VALUES($1, $2, $3)`, [Data.NUsername, Data.NPassword, Data.NDisplay])
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
}


//for adding a Blog Post
async function AddPost(Title, PostText, ImageName, ImageDir, AuthorUsername, PostCategories) {
    var PostID = 1;
    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {

        //getting a unique PostID that doesnt already exist in the database
        const result = await client.query(`SELECT PostID FROM BlogPost ORDER BY PostID ASC`)
        result.rows.forEach((row) => {
            if (PostID == row.postid) {
                PostID++;
            }
        })

        //add this post to BlogPost table
        await client.query(`INSERT INTO BlogPost VALUES($1, $2, $3, $4, $5, $6)`, [PostID, Title, PostText, ImageName, ImageDir, AuthorUsername])

        //add this post to PostCategories table
        for (var i=0; i<PostCategories.length; i++) {
            const PostCategory = PostCategories[i]
            await client.query(`INSERT INTO PostCategories VALUES($1, $2)`, [PostCategory, PostID])
        }

        //add this post to PostCategories table for All
        await client.query(`INSERT INTO PostCategories VALUES(0, $1)`, [PostID])
    } catch(err) {
        console.log(err)
    } finally {
        client.end();   
    }
}

async function LoginServicer (Data) {

    //connect to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT * FROM Users WHERE Username=$1`, [Data.Username]) //query for the username and its corresponding password and display name of the username inputted, from the DB
        if (result.rows[0] == null){ //if the inputted username doesnt exist, username is incorrect thus respond with false
            return {res: false}
        } else if (result.rows[0].password == Data.Password) { //inputted username does exist, and if the corresponding password from the DB matches the password inputted, allow login
            return {res: true, Display: result.rows[0].displayname}
        } else { //if username is correct but password is wrong, respond with false
            return {res: false}
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
}

async function SignupServicer (Data) {

    //connect to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT * FROM Users WHERE Username=$1`, [Data.NUsername]) //query for the username and its corresponding password and display name of the username inputted, from the DB
        if (result.rows[0] !== undefined){ //if the username already exists, cannot create duplicate username, thus respond with false
            return {res: false}
        } else { //if the username doesnt yet exist, username is valid
            if (Data.isPWValid) { //if the passwords inputted are valid,
                AddUser(Data) //add a user with method AddUser()
            }
            return {res: true} //respond wit true regardless, as we are only checking if the username is valid or not
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
}

async function PostBlogServicer (Data, Image) {

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
    var ImageDir;
    try {
        const files = await fs.promises.readdir(FileDir) //read all file names in the Images blog_post/blog_back/Images directory
        var name = 1; //image names start with 1
        files.forEach(function (file) { //iterate through the file names
            var filename;
            var fileextension;

            //separate the file name and extensions and store them in filename and fileextension respectively
            for (var i=file.length-1; i>=0; i--) { 
                if (file[i] == '.') {
                    fileextension = file.slice(i)
                    filename = parseInt(file.slice(0, i)) //store the fiename as an integer because it makes it easier to get unique file names for our new Image later
                }
            }

            if(extension == fileextension) { //if the current file's extension is the same as that of the image we want to add, we must make sure their names are different
                
                //assigns name to be an integer that is 1 larger than the largest integer with the same extension
                //thus, name + extension is now unique in the directory
                if (name <= filename) {
                    name = filename + 1;
                }
            }
        });
    
        //the unique Image file name
        const newIMGname = name + extension
    
        //save the Image in the directory
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
    const PostCategories = Data.Categories.split(',');

    AddPost(Title, PostText, ImageName, ImageDir, AuthorUsername, PostCategories); //add the post using the method AddPost()
    
    return {res: 'success!'} //respond with a successful message
}

async function GetBlogs(Data) {

    //getting the received Categories data into an array of integers
    var Cats = Data.Cats;
    Cats = Cats.split(',')
    for (var i=0; i<Cats.length; i++) {
        Cats[i] = parseInt(Cats[i])
    }

    //connect to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
    })
    client.connect();

    var Posts = [];
    try {
        const result = await client.query(`SELECT DISTINCT X.PostID, X.Title, X.PostText, X.ImgName, X.ImgDir, X.Username, X.DisplayName FROM (SELECT BlogPost.PostID, BlogPost.Title, BlogPost.PostText, BlogPost.ImgName, BlogPost.ImgDir, Users.Username, Users.DisplayName FROM BlogPost JOIN Users ON BlogPost.Username = Users.Username) X JOIN PostCategories Y ON X.PostID=Y.PostID WHERE Y.CategoryID = ANY($1::int[])`, [Cats]) //select the blog posts from DB
        if (result.rows.length == 0) { //if no posts exists in DB, end connection to DB and respond with a null
            client.end();
            return {res: null}
        }

        //if post(s) exists,
        //iterate through the results to add information about post to array Posts
        for (var i=0; i<result.rows.length; i++) {
            row = result.rows[i]
            ImageBuffer = await fs.promises.readFile(row.imgdir) //get Buffer data of the image using the directory stored in the DB

            Posts[i] = {PostID: row.postid, Title: row.title, PostText: row.posttext, ImageName: row.imgname, Image: ImageBuffer.toString('base64') /* convert the Image Buffer Data into a base64 string such that it can be easily displayed on front end */, Username: row.username, DisplayName: row.displayname} //add to array Posts
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: Posts} //respond with the data of the Posts
}

async function DeleteBlogServicer(Data) {

        //connect to DB
        const client = new Client({
            user: 'postgres',
            database: 'blogserver',
            password: 'sdj20041229',
            port: 5432,
            host: 'localhost',
          })
        client.connect();

        //get PostID to Delete
        const PostID = await Data.PostID;

        try {
            const result = await client.query(`SELECT ImgDir FROM BlogPost WHERE PostID = $1`, [PostID]) //query the DB for the directory of the image to delete from server
            const ImgDir = result.rows[0].imgdir
            fs.promises.unlink(ImgDir) //delete the image file at the directory ImgDir
            await client.query(`DELETE FROM Comments WHERE PostID=$1`, [PostID]) //Delete all Comments related to this Post
            await client.query(`DELETE FROM BlogPost WHERE PostID=$1`, [PostID]) //Delete the Post with PostID given in Data from the DB
        } catch(err) {
            console.log(err)
        } finally {
            client.end();
        }
        return {res: 'success!'} //respond with a successful message
}

async function GetCommentsServicer(Data) {
    const PostID = Data.PostID
    var Comments;

    //connect to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT CommentID, Users.Username, Comment, DisplayName FROM Comments JOIN Users ON Comments.Username = Users.Username WHERE Comments.PostID = $1`, [PostID]) //query the DB for all Comments with corresponding CommentID, Username and DisplayName
        Comments = result.rows //put the resultant array of Comment information into Comments
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: Comments} //respond with this array with key 'res'
}

async function AddCommentServicer(Data) {
    var CommentID = 1;
    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {

        //getting a unique CommentID that doesnt already exist in the database
        const result = await client.query(`SELECT CommentID FROM Comments ORDER BY CommentID ASC`)
        result.rows.forEach((row) => {
            if (CommentID == row.commentid) {
                CommentID++;
            }
        })

        //get all the rest of the information on the new comment
        const PostID = Data.PostID;
        const Username = Data.Username;
        const NewComment = Data.NewComment;
    
        await client.query(`INSERT INTO Comments VALUES($1, $2, $3, $4)`, [CommentID, PostID, Username, NewComment]) //add the new comment into the DB

    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: 'success!'} //respond with a successful message
}

async function DeleteCommentServicer(Data) {

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        await client.query(`DELETE FROM Comments WHERE CommentID=$1`, [Data.CommentID]) //Delete the Comment from DB
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: 'success!'} //respond with a successful message
}

async function GetLikesCountServicer(Data) {
    var LikesCount;

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();
    
    try {
        const result = await client.query(`SELECT COUNT(Username) AS LikesCount FROM Likes WHERE PostID=$1 GROUP BY PostID`, [Data.PostID]) //querythe DB to get the number of likes for a post
        if(result.rows.length == 0) {
            LikesCount = 0;
        } else {
            LikesCount = result.rows[0].likescount
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: LikesCount}
}

async function GetLikedStateServicer(Data) {
    var isLiked = false;

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT Username FROM Likes WHERE PostID=$1`, [Data.PostID]) //query the DB to get the number of likes for a post
        for (var i=0; i<result.rows.length; i++) { //iterates through the resultant response from the query
            if (result.rows[i].username == Data.CurrUser) {
                isLiked = true //makes isLiked true only if the current user's Username exists in this response AKA User already Liked the Post
                break
            }
        }
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: isLiked}
}

async function AddLikeServicer(Data) {

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`INSERT INTO Likes VALUES($1, $2)`, [Data.PostID, Data.CurrUser]) //Adds the like record into the DB
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: 'success!'}
}

async function RemoveLikeServicer(Data) {

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`DELETE FROM Likes WHERE PostID=$1 AND Username=$2`, [Data.PostID, Data.CurrUser]) //Removes the like record from the DB
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: 'success!'}
}

async function GetAllCatsServicer() {
    var Cats;

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        const result = await client.query(`SELECT * FROM Categories ORDER BY CategoryID ASC`) //Queries the DB for all Categories
        Cats = result.rows

    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: Cats}
}

async function AddCategoryServicer(Data) {
    const CategoryName = Data.CategoryName
    var CategoryID = 1; //CategoryID starts from 1 since 0 is All

    //connecting to DB
    const client = new Client({
        user: 'postgres',
        database: 'blogserver',
        password: 'sdj20041229',
        port: 5432,
        host: 'localhost',
      })
    client.connect();

    try {
        //getting a unique CommentID that doesnt already exist in the database
        const result = await client.query(`SELECT CategoryID FROM Categories ORDER BY CategoryID ASC`)
        result.rows.forEach((row) => {
            if (CategoryID == row.categoryid) {
                CategoryID++;
            }
        })

        await client.query(`INSERT INTO Categories VALUES($1, $2)`, [CategoryID, CategoryName]) //Queries the DB for all Categories
    } catch(err) {
        console.log(err)
    } finally {
        client.end();
    }
    return {res: 'success!'}
}

module.exports = { LoginServicer, SignupServicer, PostBlogServicer, GetBlogs, DeleteBlogServicer, GetCommentsServicer, AddCommentServicer, DeleteCommentServicer, GetLikesCountServicer, GetLikedStateServicer, AddLikeServicer, RemoveLikeServicer, GetAllCatsServicer, AddCategoryServicer };