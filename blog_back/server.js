//imports for all the Routes
const AccountRouters = require('./Controller/Routes/AccountRoutes.js');
const BlogRoutes = require('./Controller/Routes/BlogRoutes.js');
const CommentRoutes = require('./Controller/Routes/CommentRoutes.js');
const LikeRoutes = require('./Controller/Routes/LikeRoutes.js');
const CategoryRoutes = require('./Controller/Routes/CategoryRoutes.js');

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

//using all these routes for the backend
app.use(AccountRouters);
app.use(BlogRoutes);
app.use(CommentRoutes);
app.use(LikeRoutes);
app.use(CategoryRoutes);


app.listen(3001);