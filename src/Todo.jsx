import React, { useState, useEffect } from 'react';
import './Todo.css';

function Todo() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) {
      alert('Task cannot be empty');
      return;
    }
    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getFilteredSortedTasks = () => {
    let filtered = [...tasks];

    if (filter === 'completed') filtered = filtered.filter(t => t.completed);
    else if (filter === 'pending') filtered = filtered.filter(t => !t.completed);

    if (sort === 'asc') filtered.sort((a, b) => a.text.localeCompare(b.text));
    else if (sort === 'desc') filtered.sort((a, b) => b.text.localeCompare(a.text));
    else if (sort === 'completed') filtered.sort((a, b) => b.completed - a.completed);

    return filtered;
  };

  return (
    <div className="app">
      <h1>React To-Do List</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter task..."
          value={task}
          onChange={e => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="controls">
        <div>
          <label>Filter: </label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label>Sort: </label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
            <option value="completed">Completed First</option>
          </select>
        </div>
      </div>

      <ul className="task-list">
        {getFilteredSortedTasks().map(t => (
          <li key={t.id} className="task-item">
            <div className="task-content" onClick={() => toggleTask(t.id)}>
              <span className="checkbox">{t.completed ? '✅' : '⬜'}</span>
              <span className={t.completed ? 'task-text completed' : 'task-text'}>
                {t.text}
              </span>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
