const express = require('express');
const app = express();
const port = 3000;


app.get('/',(req,res)=>{
    res.send("this is a response from server")
});

app.listen(port, ()=>{
    console.log(`Running server on ${port}`);
});


//Todo:
// 1. Add a single Note.
// 2. Show all Notes List.
// 3. Delete A Note.
// 4. Search a note with title.
// Note(title,desc,_id)
