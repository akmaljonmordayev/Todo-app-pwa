import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Todo.css";
import React from "react";

const API_URL = "https://6943fca37dd335f4c35eda70.mockapi.io/todos";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const getTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Todo bo‘sh bo‘lmasin!");
      return;
    }
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, { text });
      toast.success("Todo tahrirlandi ✏️");
      setEditId(null);
    } else {
      await axios.post(API_URL, {
        text,
        completed: false,
      });
      toast.success("Todo qo‘shildi ✅");
    }

    setText("");
    getTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    toast.info("Todo o‘chirildi 🗑️");
    getTodos();
  };

  const toggleTodo = async (todo) => {
    await axios.put(`${API_URL}/${todo.id}`, {
      completed: !todo.completed,
    });
    toast.success("Status yangilandi ✨");
    getTodos();
  };

  const editTodo = (todo) => {
    setText(todo.text);
    setEditId(todo.id);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>📝 Todo List</h1>
      <div className="add-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Todo yozing..."
        />
        <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
      </div>
      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ToastContainer position="top-left" autoClose={1000} />
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "done" : ""}>
            <span onClick={() => toggleTodo(todo)}>{todo.text}</span>

            <div className="actions">
              <button onClick={() => editTodo(todo)}>✏️</button>
              <button onClick={() => deleteTodo(todo.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
