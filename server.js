const express = require("express");
const cors = require('cors') ; 
const routes  = require('routes.js'); 
const app = express(); 

app.use(cors()); 
app.use(express.json())

app.use('/items', routes)



app.listen(5000, () => console.log(`Listening @ 5000`)); 