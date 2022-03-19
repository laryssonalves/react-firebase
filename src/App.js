import React, { useEffect, useState } from 'react';
import Container from './components/Container';
import Form from './components/Form';
import List from './components/List';
import ListItem from './components/ListItem';
import ListItemInfo from './components/ListItemInfo.js';
import ListItemButtons from './components/ListItemButtons';
import { Button, Checkbox } from '@mui/material';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import db from './firebase.config'
import { onValue, ref, set, push, remove } from  'firebase/database';
import './App.css';
import { parseISO } from 'date-fns';

const todoListRef = ref(db, 'todos')
const todoListItemRef = key => ref(db, 'todos/' + key)

function App() {
  const [todo, setTodo] = useState({ key: null, title: '', date: null, completed: false, editing: false });
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    onValue(todoListRef, snapshot => {
      const todos = [];

      snapshot.forEach(child => {
        const data = child.val();
        todos.push({ ...data, key: child.key, date: parseISO(data.date) })
      })

      setTodoList(todos)
    } )
  }, [])

  function saveTodo() {
    if (!todo.title || !todo.date) return;

    if (!todo.editing) {
      const newTodoRef = push(todoListRef)
      set(newTodoRef, {
        title: todo.title,
        date: todo.date.toISOString(),
        completed: todo.completed
      });
    } else {
      set(todoListItemRef(todo.key), {
        title: todo.title,
        date: todo.date.toISOString(),
        completed: todo.completed
      })
    }

    setTodo({ title: '', date: null, completed: false, editing: false });
  }

  function setCompleted(index, completed) {
    const todo = todoList[index];
    set(todoListItemRef(todo.key), { 
      title: todo.title,
      date: todo.date.toISOString(),
      completed,
    })
  }

  async function deleteTodo(todo) {
    remove(todoListItemRef(todo.key))
  }

  return (
    <Container>
      <Form>
        <TextField 
          className="titleInput" 
          label="Task title" 
          placeholder='Type the task title' 
          value={todo.title}
          onChange={event => setTodo({ ...todo, title: event.target.value })} 
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={todo.date}
            onChange={(date) => {
              setTodo({ ...todo, date });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button onClick={saveTodo}>Save</Button>
      </Form>
      <List>
        {
          todoList.map((todo, index) => (
            <ListItem key={index}>
              <ListItemInfo>
                <span>{todo.title}</span>
                <span>{todo.date.toLocaleString()}</span>
              </ListItemInfo>
              <ListItemButtons>
                <Checkbox onChange={ event => { setCompleted(index, event.target.checked) } }/>
                <Button onClick={() => setTodo({ ...todo, editing: true })}>Edit</Button>
                <Button onClick={() => deleteTodo(todo)}>Delete</Button>
              </ListItemButtons>
            </ListItem>
          ))
        }
      </List>
    </Container>
  );
}

export default App;
