import React, { useContext, useState, useEffect, useRef } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const { showAlert } = props;
  let navigate = useNavigate();
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [getNotes, navigate]);

  const ref = useRef(null);
  const refClose = useRef(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [note, setNote] = useState({
    id: "",
    upd_title: "",
    upd_description: "",
    upd_tag: "default",
  });

  const updateNote = (currentNote) => {
    ref.current.click();
    setCurrentNote(currentNote);
    setNote({
      id: currentNote._id,
      upd_title: currentNote.title,
      upd_description: currentNote.description,
      upd_tag: currentNote.tag,
    });
  };

  const handleClick = () => {
    editNote(note.id, note.upd_title, note.upd_description, note.upd_tag);
    props.showAlert("Note updated", "primary");
    refClose.current.click();
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <AddNote showAlert={showAlert} />
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="upd_title"
                    name="upd_title"
                    value={note.upd_title}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="upd_description"
                    name="upd_description"
                    value={note.upd_description}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="upd_tag"
                    name="upd_tag"
                    value={note.upd_tag}
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={handleClick}
                disabled={
                  currentNote &&
                  note.upd_title === currentNote.title &&
                  note.upd_description === currentNote.description &&
                  note.upd_tag === currentNote.tag
                }
                type="button"
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h1>Your Notes</h1>
        <div className="container mx-3">
          {notes.length === 0 && "No Notes to display!"}
        </div>
        {notes.map((note) => (
          <NoteItem key={note._id} updateNote={updateNote} notes={note} showAlert={showAlert} />
        ))}
      </div>
    </div>
  );
};

export default Notes;
