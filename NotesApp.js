const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const NOTES_FILE_PATH = './notes.json';

//set middleware
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("this is a response from server")
});

//Get All Notes
app.get('/notes',(req,res)=>{
    fs.readFile(NOTES_FILE_PATH,'utf-8',(err,data)=>{
        if(err && err.code != 'ENOENT'){
            return res.status(500).json({error:"Fail to read the file"});
        } else if(err && err.code == 'ENOENT'){
            return res.status(200).send('');
        }
        let result = JSON.parse(data);
        return res.status(200).send(result);
    });
});

//Add new Note
app.post('/note',(req,res) => {
    const {title, desc} = req.body;

    if(!title || !desc){
        return res.status(400).json({error:'Title or desc is missing'});
    }

    fs.readFile(NOTES_FILE_PATH,'utf-8',(err,data)=> {
        if(err && err.code != 'ENOENT'){
            return res.status(500).json({error: 'Failed to read Notes file'})
        } else if (err && err.code == 'ENOENT'){
            data = null;
        }
        
        let notes = [];
        if(data != null){
            notes = JSON.parse(data);
        }
        const newNote = {
            _id: Date.now().toString(),
            title:title,
            desc:desc
        }

        notes.push(newNote);

        fs.writeFile(NOTES_FILE_PATH,JSON.stringify(notes),(err)=>{
            if(err){
                return res.status(500).json({error:'Failed to write notes'});
            }

            res.status(201).json(newNote);
        });
    });

});

//Delte a Note with id
app.delete('/notes/:id',(req,res) => {
    const noteId = req.params.id;

    if(!noteId){
        return res.status(400).json({error:'Please enter a node id'});
    }

    fs.readFile(NOTES_FILE_PATH,'utf-8',(err,data)=>{
        if(err && err.code != 'ENOENT'){
            return res.status(500).json({error:"Fail to read the file"});
        } else if(err && err.code == 'ENOENT'){
            return res.status(200).send('No note exist');
        }

        let result = JSON.parse(data);
        let newResult = [];
        let contains = false;
        result.forEach(element => {
            if(element._id == noteId){
                contains = true;
            } else {
                newResult.push(element);
            }
        });

        if(!contains){
            return res.status(400).json({error:'This Note doesn\'t exist'});
        }

        fs.writeFile(NOTES_FILE_PATH,JSON.stringify(newResult),(err)=>{
            if(err){
                return res.status(500).json({error:'Something went wrong'});
            }

            return res.status(200).send('Succesfully deleted');
        });

    });
});

//Search a note
app.get('/note',(req,res)=>{
    const title = req.query.title;
    if(!title){
        return res.status(400).json({error:'Please send a title in query'});
    }
    fs.readFile(NOTES_FILE_PATH,'utf-8',(err,data)=>{
        if(err && err.code != 'ENOENT'){
            return res.status(500).json({error:"Fail to read the file"});
        } else if(err && err.code == 'ENOENT'){
            return res.status(200).send('');
        }

        const parsedData = JSON.parse(data);
        let result = [];
        parsedData.forEach(element => {
            if(element.title.includes(title)){
                result.push(element); 
            }
        });

        return res.status(200).json(result);
    });

});

app.listen(port, ()=>{
    console.log(`Running server on ${port}`);
});


//Todo:
// 1. Add a single Note. ✅
// 2. Show all Notes List. ✅
// 3. Delete A Note.✅
// 4. Search a note with title. ✅
// Note(title,desc,_id)
