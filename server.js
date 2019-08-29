const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const config = require('config'); 


const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

app.use(express.json());
app.use('/style_api', express.static('style_api'));
app.use('/images/profile_img', express.static('images/profile_img'));
app.use('/images/post_img', express.static('images/post_img'));
// DB Config
const db = config.get('mongoURI');

// Connect to Mongo 
mongoose
  .connect(db, { 
    useNewUrlParser: true,
    useCreateIndex: true 
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// Use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth').router);
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/img_profile', require('./routes/api/img_profile'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/friendship', require('./routes/api/friendship'));



const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server started on port ${port}`)); 