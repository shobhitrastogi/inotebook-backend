const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const cache = require('../utils/cacheMiddleware');
const { body, validationResult } = require("express-validator");
const router = express.Router();

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes', fetchuser, cache ,async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
  // Route 2 :Add a New Note using Post "api/notes/addnote" Login required
  router.post('/addnote', fetchuser,[
    body('title','Enter a valid title').isLength({min :3}),
    body('description','Enter a valid description').isLength({min:5})
  ], async (req, res) => {
    try {


    const {title,description,tag}=req.body
    // if there are error , return bad request and the errors 
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const note = new Note({
        title,description,tag,user:req.user.id  
    })
     const saveNotes = await note.save()

    res.json(saveNotes);
} catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")

}
  });

   // Route 3 :Update a New Note using Put "api/notes/updatenode" Login required
   router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title,description,tag}= req.body
    try {
      // Create a new note object
      const newnote={}
      if(title){newnote.title=title}
      if(description){newnote.description=description}
      if(tag){newnote.tag=tag}
      // Find the note to be uploaded and update it 
      let note =await Note.findById(req.params.id)
      if(!note){return res.status(404).send("not found")}

      if(note.user.toString() !==req.user.id){
        return res.status(401).send ("not allowed")
      }
      note = await Note.findByIdAndUpdate(req.params.id, {$set :newnote},{new:true})
      res.json({note})

    } catch (error) {
      console.log(error.message)
      res.status(500).send("Some error occured")

    }
    })

  router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
      // Find the note to be deleted
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      // Allow deletion only if the user owns this note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }

      // Delete the note
      await Note.findByIdAndDelete(req.params.id);
      res.json({ success: 'Note has been deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;