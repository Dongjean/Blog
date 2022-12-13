# Title: Blog app
This app is:
Using PostgreSQL 15.1
Using Node.js v18.12.1
Using NPM 8.19.2
Using express JS for the Backend and React JS for the front end

This app is a web application which allows users to create accounts and post blogs on a blogging website

# Please install the following using Node Package Manager if not already before starting
npm install express
npm install cors
npm install pg
npm install express-fileupload
npm install create-react-app
npm install react-router-dom

# Database design for BlogServer Database:
#### (REF tablename) means that field references Table tablename,
#### *Italisized = Primary/Composite Keys*, 
#### **Bold = Foreign Keys**
  Users(*Username*, Password, DisplayName)
  BlogPost(*PostID*, Title, PostText, ImgName, ImgDir, Username)
  Comments(*CommentID*, **PostID(REF BlogPost)**, **Username(REF Users)**, Comment)
  Likes(***PostID(REF BlogPost)***, ***Username(REF Users)***)
  Categories(*CategoryID*, Category)
  PostCategories(***CategoryID(REF Categories)***, ***PostID(REF BlogPost)***)
  
### Username in the BlogPost table above is refering to the Author of the BlogPost

Please write your own system's PostgreSQL server's username, password, port and host into the code in the Services folder in the backend folder
