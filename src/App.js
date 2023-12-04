import React, { useState, useEffect } from 'react';
import "./App.css"

const TodoList = () => {
 const [taskInput, setTaskInput] = useState('');
 const [dateInput, setDateInput] = useState('');
 const [priorityInput, setPriorityInput] = useState('low');
 const [todos, setTodos] = useState([]);
 const [alertDiv, setAlertDiv] = useState(null);

 const handleAddTodo = () => {
    const newTodo = {
      id: todos.length + 1,
      task: taskInput,
      dueDate: dateInput,
      priority: priorityInput,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTaskInput('');
    setDateInput('');

    showAlertMessage('Task added successfully');
 };

 const clearAllTodos = () => {
    setTodos([]);
    showAlertMessage('All tasks have been cleared');
 };

 const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showAlertMessage('Task deleted successfully');
 };

 const editTodo = (id) => {
    const editedTodo = todos.find((todo) => todo.id === id);
    setTaskInput(editedTodo.task);
    setDateInput(editedTodo.dueDate);
    setPriorityInput(editedTodo.priority);
    deleteTodo(id);
 };

 const toggleStatus = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    const updatedTodo = { ...todos[index], completed: !todos[index].completed };
    const updatedTodos = [...todos];
    updatedTodos[index] = updatedTodo;
    setTodos(updatedTodos);
 };

 const sortTodos = () => {
    return todos.sort((a, b) => {
      const dueDateWeight = 100;
      const statusWeight = 50;
      const priorityWeight = 10;
      const today = new Date();
      const priorityValues = { high: -1, medium: 0, low: 1 };

      const aSortingFactor = (dueDateWeight * (2 * new Date(a.dueDate) - today)) + (statusWeight * (a.completed ? 1 : 0)) + (priorityWeight * priorityValues[a.priority]);
      const bSortingFactor = (dueDateWeight * (2 * new Date(b.dueDate) - today)) + (statusWeight * (b.completed ? 1 : 0)) + (priorityWeight * priorityValues[b.priority]);

      return aSortingFactor - bSortingFactor;
    });
 };

 const displayTodos = () => {
    return sortTodos().map((todo) => (
      <tr key={todo.id}>
        <td style={{width:"40%"}}>{todo.task}</td>
        <td>{todo.dueDate}</td>
        <td>{todo.completed ? 'Completed' : 'Pending'}</td>
        <td className='buttons'>
          <button onClick={() => editTodo(todo.id)}>Edit</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          <button onClick={() => toggleStatus(todo.id)}>
            {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
          </button>
        </td>
      </tr>
    ));
 };

 useEffect(() => {
    setTodos(loadFromLocalStorage());
 }, []);

 useEffect(() => {
    saveToLocalStorage(todos);
 }, [todos]);

 const showAlertMessage = (message) => {
    setAlertDiv(<div className='alert'>{message}</div>);
    setTimeout(() => {
      setAlertDiv(null);
    }, 3000);
 };

 const saveToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
 };

 const loadFromLocalStorage = () => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
 };

 return (
    <div className='TodoList'>
      {alertDiv}

      <div className='form'>
      <h1>Todo List</h1>
        <input type='text' style={{width:"40%"}} placeholder='Task' value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
        <input type='date' placeholder='Due Date' value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
        <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className='priority'>
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>
        <button onClick={handleAddTodo} className='addtask'>Add Task</button>
        <button onClick={clearAllTodos} className='clearall'>Clear All Tasks</button>
      </div>
      <table style={{width:"100%"}}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{displayTodos()}</tbody>
      </table>
    </div>
 );
};

export default TodoList;