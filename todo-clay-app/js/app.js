const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const todoList = document.querySelector('#todoList');
const leftCount = document.querySelector('#leftCount');
const emptyMessage = document.querySelector('#emptyMessage');
const filterTabs = document.querySelectorAll('.tab');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }

    return todo;
  });

  saveTodos();
  renderTodos();
}

function getFilteredTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function updateLeftCount() {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  leftCount.textContent = `남은 할 일 ${activeCount}개`;
}

function updateEmptyMessage(filteredTodos) {
  if (filteredTodos.length === 0) {
    emptyMessage.classList.add('show');

    if (currentFilter === 'active') {
      emptyMessage.textContent = '진행중인 할 일이 없습니다.';
    } else if (currentFilter === 'completed') {
      emptyMessage.textContent = '완료된 할 일이 없습니다.';
    } else {
      emptyMessage.textContent = '아직 등록된 할 일이 없습니다.';
    }
  } else {
    emptyMessage.classList.remove('show');
  }
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

  li.innerHTML = `
    <input type="checkbox" ${todo.completed ? 'checked' : ''} aria-label="할 일 완료 체크" />
    <span class="todo-text"></span>
    <button type="button" class="delete-btn" aria-label="할 일 삭제">×</button>
  `;

  const checkbox = li.querySelector('input');
  const text = li.querySelector('.todo-text');
  const deleteButton = li.querySelector('.delete-btn');

  text.textContent = todo.text;

  checkbox.addEventListener('change', () => toggleTodo(todo.id));
  deleteButton.addEventListener('click', () => deleteTodo(todo.id));

  return li;
}

function renderTodos() {
  const filteredTodos = getFilteredTodos();

  todoList.innerHTML = '';

  filteredTodos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });

  updateLeftCount();
  updateEmptyMessage(filteredTodos);
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (!todoText) {
    todoInput.focus();
    return;
  }

  addTodo(todoText);
  todoInput.value = '';
  todoInput.focus();
});

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((button) => button.classList.remove('active'));
    tab.classList.add('active');

    currentFilter = tab.dataset.filter;
    renderTodos();
  });
});

renderTodos();
