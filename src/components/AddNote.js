import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("Note Added","primary")
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container my-3">
        <h1>Add a Note</h1>
        <form>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              name="title"
              aria-describedby="emailHelp"
              value={note.title}
              onChange={onChange}
              placeholder="text"
            />
            <label htmlFor="floatingInput">Title</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              name="description"
              value={note.description}
              onChange={onChange}
              placeholder="text"
            />
            <label htmlFor="floatingInput">Description</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              value={note.tag}
              name="tag"
              onChange={onChange}
              placeholder="text"
            />
            <label htmlFor="floatingInput">Tag</label>
          </div>
          <button
            disabled={note.title.length < 5 || note.description.length < 5 || note.tag.length<1}
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
