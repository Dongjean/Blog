# Blog app
Using PostgreSQL 15.1
Using Node.js v18.12.1
Using NPM 8.19.2
Using express JS for the Backend and React JS for the front end

Please install the following using Node Package Manager if not already before starting
npm install express
npm install cors
npm install pg
npm install express-fileupload
npm install create-react-app
npm install react-router-dom

Please write your own system's PostgreSQL server's username, password, port and host into the code in the Services folder in the backend folder

Database design for BlogServer Database: *(PK) -> PRIMARY KEY, (CK) -> COMPOSITE KEY, (FK REF tablename) FOREIGN KEY
  Users(Username(PK), Password, DisplayName)
  BlogPost(PostID(PK), Title, PostText, ImgName, ImgDir, Username)
  Comments(CommentID(PK), PostID(FK REF BlogPost), Username(FK REF Users), Comment)
  Likes(PostID(CK)(FK REF BlogPost), Username(CK)(FK REF Users))
  Categories(CategoryID(PK), Category)
  PostCategories(CategoryID(CK)(FK REF Categories), PostID(CK)(FK REF BlogPost))
  
*Username in the BlogPost table above is refering to the Author of the BlogPost
