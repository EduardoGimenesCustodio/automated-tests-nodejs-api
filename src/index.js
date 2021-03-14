const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.filter((user) => {
    return user.username === username;
  });

  if (!user[0])
    return response.status(404).json({ error: 'Mensagem do erro' });

  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const storedUser = users.filter((user) => {
    return user.username === username;
  });

  if (storedUser[0])
    return response.status(400).json({ error: 'Mensagem do erro' });

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const user = users.filter((user) => {
    return user.username === username;
  });

  return response.status(200).json(user[0].todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  const user = users.filter((user) => {
    return user.username === username;
  });

  user[0].todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.filter((user) => {
    return user.username === username;
  });

  const storedTodo = user[0].todos.filter((todo) => {
    return todo.id === id;
  });

  if (!storedTodo[0])
    return response.status(404).json({ error: 'Mensagem do erro' });

  const todo = user[0].todos.filter((todo) => {
    if (todo.id === id) {
      todo.title = title;
      todo.deadline = new Date(deadline);
    }

    return todo.id === id;
  });

  return response.status(200).json(todo[0]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.filter((user) => {
    return user.username === username;
  });

  const storedTodo = user[0].todos.filter((todo) => {
    return todo.id === id;
  });

  if (!storedTodo[0])
    return response.status(404).json({ error: 'Mensagem do erro' });

  const todo = user[0].todos.filter((todo) => {
    if (todo.id === id) {
      todo.done = true;
    }

    return todo.id === id;
  });

  return response.status(200).json(todo[0]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.filter((user) => {
    return user.username === username;
  });

  const storedTodo = user[0].todos.filter((todo) => {
    return todo.id === id;
  });

  if (!storedTodo[0])
    return response.status(404).json({ error: 'Mensagem do erro' });

  const todo = user[0].todos.filter((todo) => {
    return todo.id === id;
  });

  user[0].todos.splice(todo, 1);

  return response.status(204).json();
});

module.exports = app;