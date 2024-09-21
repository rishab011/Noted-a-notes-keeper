import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const [notes, setNotes] = useState([]);

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      const note = await response.json();
      setNotes((prevNotes) => [...prevNotes, note]);
    } catch (error) {
      console.error(error);
      // Optionally, show an alert to the user
    }
  };

  // Get all Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notes');
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error(error);
      // Optionally, show an alert to the user
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      if (!response.ok) throw new Error('Failed to delete note');
      const json = await response.json();
      console.log(json);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
      // Optionally, show an alert to the user
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      });
      if (!response.ok) throw new Error('Failed to update note');
      const json = await response.json();
      console.log(json);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, title, description, tag } : note
        )
      );
    } catch (error) {
      console.error(error);
      // Optionally, show an alert to the user
    }
  };

  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
