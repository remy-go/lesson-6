(function() {
var todoContainer = document.getElementById('todo-container'),
todoInput = document.getElementById('new-todo'),
todoExample = document.getElementsByClassName('todo-example')[0],
  controlPanel = document.getElementsByClassName('control-panel')[0],
  checkAllBox = controlPanel.children[0],
  itemsRemainingField = controlPanel.children[1],
  showAllButton = document.querySelector('.control-panel #all'),
  showUncompletedButton = document.querySelector('.control-panel #uncompleted'),
  showCompletedButton = document.querySelector('.control-panel #completed'),
  removeCompletedButton = document.querySelector('.control-panel #remove-completed');

var listState = (function() {
  var show = 'all',
  uncompleted = 0, completed = 0, total = 0; 

  function filter(option) {
    return option ? show = option : show;
  }
  function all(plusminus) {
    return plusminus ? total += plusminus : total;
  }
  function remaining(plusminus) {
    return plusminus ? uncompleted += plusminus : uncompleted;
  }
  function SetRemaining(number) {
    uncompleted = number;
    return uncompleted;
  }
  return { filter: filter, remaining: remaining, all: all, SetRemaining: SetRemaining };
})();

todoInput.addEventListener('keypress', handleNewTodo);
checkAllBox.addEventListener('change', checkAllToggle);
showUncompletedButton.addEventListener('click', showUncompleted);
showCompletedButton.addEventListener('click', showCompleted);
showAllButton.addEventListener('click', showAll);
removeCompletedButton.addEventListener('click', removeCompleted);

function updateItemsRemainingField() {
  itemsRemainingField.innerHTML = 'Liko ' + listState.remaining();
}

function getTodos() {
  return Array.from(document.querySelectorAll('#todo-container .todo-note'));
}

function setCompleted(todo) {
  todo.children[0].checked = true;
  todo.classList.add('completed');
}

function setUncompleted(todo) {
  todo.children[0].checked = false;
  todo.classList.remove('completed');
}

function isCompleted(todo) {
  return todo.children[0].checked;
}

function handleNewTodo(keypress) {
  if(keypress.key === 'Enter' && /\S/.test(todoInput.value)) {
    var todo = receiveNewTodo();
    todoInput.value = '';
    setListeners(todo);
    insertTodo(todo);
  }
}

function receiveNewTodo() {
  var newTodo = todoExample.cloneNode(true),
  noteField = newTodo.children[1];
  noteField.innerHTML = todoInput.value;
  return newTodo;
}

function setListeners(todo) {
  var checkbox = todo.children[0],
  closeButton = todo.children[2];
  checkbox.addEventListener('change', function() { completedToggle(todo); }); 
  closeButton.addEventListener('click', function() { closeTodo(todo); });
}

function insertTodo(todo) {
  todo.classList.add('todo-note');
  if(listState.filter() === 'completed')
    todo.style.display = 'none';
  todoContainer.appendChild(todo);
  checkAllBox.checked = false;
  listState.remaining(+1);
  listState.all(+1);
  updateItemsRemainingField();
}

function completedToggle(todo) {
  todo.classList.toggle('completed');
  if(isCompleted(todo)) {
    if(listState.remaining(-1) === 0) { 
      checkAllBox.checked = true;
    }
  }
  else {
    listState.remaining(+1);
    checkAllBox.checked = false;
  }
  updateView();
}

function checkAllToggle() {
  var todoNotes = getTodos();
  if(checkAllBox.checked) {
    todoNotes.forEach(setCompleted);
    listState.SetRemaining(0);
  }
  else {
    todoNotes.forEach(setUncompleted);
    listState.SetRemaining(listState.all());
  }
  updateView();
}

function closeTodo(todo) {
  if(!isCompleted(todo)) { 
    listState.remaining(-1);
    updateItemsRemainingField();
  }
  removeTodo(todo);
}

function removeTodo(todo) {
  todo.parentNode.removeChild(todo);
  listState.all(-1);
}

function removeCompleted() {
  getTodos().forEach(function(todo) {
    if(isCompleted(todo))
      removeTodo(todo);
  });
  checkAllBox.checked = false;
}

function updateView() {
  switch(listState.filter()) {
    case 'all': showAll(); break;
    case 'uncompleted': showUncompleted(); break;
    case 'completed': showCompleted();
  }
  updateItemsRemainingField();
}

function switchFilter(filter) {
  var previous = listState.filter(); 
  if(previous !== filter) {
    document.querySelector('.control-panel ' + '#' + previous).classList.remove('pressed');
    document.querySelector('.control-panel ' + '#' + filter).classList.add('pressed');
    listState.filter(filter);
  }
}

function showAll() {
  switchFilter('all');
  getTodos().forEach(function(todo) {
    todo.style.display = 'block';
  });
}

function showUncompleted() {
  switchFilter('uncompleted');
  getTodos().forEach(function(todo) {
    todo.style.display = isCompleted(todo) ? 'none' : 'block';
  });
}

function showCompleted() {
  switchFilter('completed');
  getTodos().forEach(function(todo) {
    todo.style.display = isCompleted(todo) ? 'block' : 'none';
  });
}
})();
