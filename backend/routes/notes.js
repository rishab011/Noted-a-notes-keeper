const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

//ROUTE-1: To fetch all notes of a user using GET "/api/notes/fetchallnotes" . Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTE-2: To add new notes using POST "/api/notes/addnotes". Login Required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a title").isLength({ min: 3 }),
    body("description", "Enter the description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If error, then discard
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //else add the note
      const note = new Notes({
        //Promise
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//ROUTE-3: To update notes using PUT "/api/notes/updatenotes". Login Required
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a new Note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Check if such user is present
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    //Check is user is accessing his own note
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed");
    }

    //Updating the note
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTE-4: To delete notes using DELETE "/api/notes/deletenotes". Login Required
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    //Check if such user is present
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    //Check is user is accessing his own note
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed");
    }

    //Deleting the note
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
