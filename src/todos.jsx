import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import giff from '/load.gif';
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Todos({ credentials }) {
  const [todos, setTodos] = useState(null);
  const [newtitle, setNewTitle] = useState("");

  useEffect(() => {
    if (!credentials?.uid) return;
    const todoCollRef = collection(db, `todos/${credentials.uid}/items`);
    const q = query(todoCollRef);
    const todounsub = onSnapshot(
      q,
      snapshot => {
        const todosArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTodos(todosArray);
      },
      err => console.error('Snapshot error: ', err)
    );
    return () => todounsub();
  }, [credentials?.uid]);

  if (todos == null) {
    return (
      <div className="loading-state">
        <img src={giff} alt="Loading todos" />
      </div>
    );
  }

  return (
    <section className="todos-panel">
      <header className="todos-header">
        <div>
          <h3 className="todos-title">Showing your todos</h3>
          <p className="todos-subtitle">{credentials?.user?.email}</p>
        </div>
        <button className="secondary-btn" type="button" onClick={() => signOut(auth)}>Sign Out</button>
      </header>

      <div className="todo-list" role="list">
        {todos.length === 0 ? (
          <div className="empty-state">No todos found</div>
        ) : (
          todos.map(todo => (
            <div className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id} role="listitem">
              <label className="checkbox-container">
                <input
                  id={todo.id}
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={async ev => {
                    const tododocref = doc(db, `todos/${credentials?.uid}/items`, todo.id);
                    await updateDoc(tododocref, { completed: ev.target.checked });
                  }}
                />
                <span className="checkbox-custom" aria-hidden="true" />
              </label>
              <label className="todo-label" htmlFor={todo.id}>
                {todo.title}
              </label>
              <button
                className="icon-btn"
                type="button"
                aria-label={`Delete ${todo.title}`}
                onClick={() => {
                  const tododocref = doc(db, `todos/${credentials?.uid}/items`, todo.id);
                  deleteDoc(tododocref);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}
      </div>

      <form
        className="todo-form"
        onSubmit={async ev => {
          ev.preventDefault();
          if (!newtitle.trim() || !credentials?.uid) return;
          const todoCollRef = collection(db, `todos/${credentials.uid}/items`);
          await addDoc(todoCollRef, { title: newtitle, completed: false });
          setNewTitle("");
        }}
      >
        <label className="field-label" htmlFor="new-title">Title</label>
        <div className="form-field inline">
          <input
            className="field-input"
            id="new-title"
            type="text"
            placeholder="Add a new task"
            value={newtitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <button className="primary-btn" type="submit">Add todo</button>
        </div>
      </form>
    </section>
  );
}

export default Todos;
