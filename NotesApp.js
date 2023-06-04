const express = require('express');
const app = express();
const port = 3000;


app.get('/',(req,res)=>{
    res.send("this is a response from server")
});

app.listen(port, ()=>{
    console.log(`Running server on ${port}`);
});
