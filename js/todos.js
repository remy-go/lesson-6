var todoContainer = document.getElementById('todo-container'),
    inputForm = document.getElementById('input-form'),
    todoInput = document.getElementById('new-todo'),
    todoExample = document.getElementsByClassName('todo-example')[0],
    controlPanel = document.getElementsByClassName('control-panel')[0],
    checkAllBox = controlPanel.children[0],
    itemsLeft = controlPanel.children[1],
    showAllButton = controlPanel.children[2],
    showUncompletedButton = controlPanel.children[3],
    showCompletedButton = controlPanel.children[4],
    removeCompletedButton = controlPanel.children[5],
    todoNotes;

inputForm.addEventListener('submit', receiveNewTodo);
checkAllBox.addEventListener('change', checkAllToggle);
showUncompletedButton.addEventListener('click', showUncompleted);
showCompletedButton.addEventListener('click', showCompleted);
showAllButton.addEventListener('click', showAll);
removeCompletedButton.addEventListener('click', removeCompleted);

var filter = (function() {
  var state = 'all';
  return { 'state': state };
})();

var todosCounter = (function() {
  var completed = 0,
      all = 0;
  return { completed: completed, all: all };
})();

function receiveNewTodo() {
  var newTodo = todoExample.cloneNode(true),
      checkbox = newTodo.children[0],
      noteField = newTodo.children[1],
      closeButton = newTodo.children[2];
  newTodo.classList.add('todo-note');
  noteField.innerHTML = todoInput.value;
  checkbox.addEventListener('change', completedToggle(checkbox));
  closeButton.addEventListener('click', closeTodo(newTodo));
  insertTodo(newTodo);
}

function insertTodo(todo) {
  if(/\S/.test(todoInput.value)) {
  todoContainer.appendChild(todo);
  checkAllBox.checked = false;
  todosCounter.all++;
  itemsLeft.innerHTML = 'Liko ' + (todosCounter.all - todosCounter.completed);
  console.log(todo);
  todoInput.value = '';
  }
}

function showAll() {
  todoNotes = Array.from(document.querySelectorAll('#todo-container .todo-note'));
  filter.state = 'all';
  todoNotes.forEach(function(note) {
    note.style.display = 'block';
  });
}

function showUncompleted() {
  todoNotes = Array.from(document.querySelectorAll('#todo-container .todo-note'));
  filter.state = 'uncompleted';
  todoNotes.forEach(function(note) {
    if(note.children[0].checked)
      note.style.display = 'none'; 
    else 
      note.style.display = 'block';
  });
}

function showCompleted() {
  todoNotes = Array.from(document.querySelectorAll('#todo-container .todo-note'));
  filter.state = 'completed';
  todoNotes.forEach(function(note) {
    if(note.children[0].checked)
      note.style.display = 'block'; 
    else
      note.style.display = 'none'; 
  });
}

function closeTodo(todo) {
  return function() {
    if(todo.children[0].checked === false) 
      itemsLeft.innerHTML = 'Liko ' + (--todosCounter.all - todosCounter.completed);
    else {
      todosCounter.all--;
      todosCounter.completed--;
    }
    todo.parentNode.removeChild(todo);
  };
}

function completedToggle(checkbox) {
  return function() {
      checkbox.parentNode.classList.toggle('completed');
      if(checkbox.checked) {
        todosCounter.completed++;
        if(todosCounter.all === todosCounter.completed) 
          checkAllBox.checked = true;
      }
      else {
        todosCounter.completed--;
        checkAllBox.checked = false;
      }
      itemsLeft.innerHTML = 'Liko ' + (todosCounter.all - todosCounter.completed);
  };
}

function checkAllToggle() {
  todoNotes = Array.from(document.querySelectorAll('#todo-container .todo-note'));
  if(checkAllBox.checked) {
    todoNotes.forEach(function(note) {
      note.children[0].checked = true;
      note.classList.add('completed');
    });
    todosCounter.completed = todoNotes.length;
  }
  else {
    todoNotes.forEach(function(note) {
      note.children[0].checked = false;
      note.classList.remove('completed');
    });
    todosCounter.completed = 0;
  }
  updateView();
}

function updateView() {
    if (filter.state === 'all')
      showAll();
    else if (filter.state === 'completed')
      showCompleted();
    else
      showUncompleted();
    itemsLeft.innerHTML = 'Liko ' + (todosCounter.all - todosCounter.completed);
}

function removeCompleted() {
  todoNotes = Array.from(document.querySelectorAll('#todo-container .todo-note'));
  todoNotes.forEach(function(note) {
    if(note.children[0].checked) {
      todosCounter.completed--;
      todosCounter.all--;
      note.parentNode.removeChild(note); 
    }
  itemsLeft.innerHTML = 'Liko ' + (todosCounter.all - todosCounter.completed);
  });
  checkAllBox.checked = false;
}

