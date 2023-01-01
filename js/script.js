const taskForm = document.getElementById('task-form');
const tasksContainer = document.querySelector('.main-content .tasks-container');

let allTasks = [];

if (localStorage.getItem('tasks')) getTasks();
else createEmptyElement();

function toggleTaskStatus() {
  const parentElt = this.parentElement.parentElement;
  let taskIndex = allTasks.findIndex(
    (task) => Number(parentElt.dataset.id) === task.id
  );

  if (parentElt.classList.toggle('done'))
    allTasks[taskIndex].isCompleted = true;
  else allTasks[taskIndex].isCompleted = false;

  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

function createEmptyElement() {
  const empty = document.createElement('div');
  empty.className = 'empty';

  const para = document.createElement('p');
  para.textContent = 'There Are No ';

  const span = document.createElement('span');
  span.textContent = 'Tasks Available.';

  tasksContainer.appendChild(empty).appendChild(para).appendChild(span);
}

function deleteTask() {
  const parentElt = this.parentElement.parentElement;
  parentElt.remove();

  allTasks = allTasks.filter(
    (task) => task.id !== Number(parentElt.dataset.id)
  );
  localStorage.setItem('tasks', JSON.stringify(allTasks));

  if (!allTasks.length) createEmptyElement();
}

function createTaskElements() {
  if (tasksContainer.firstElementChild?.classList?.contains('empty'))
    tasksContainer.firstElementChild.remove();

  const fragment = document.createDocumentFragment();
  for (let i = tasksContainer.childElementCount; i < allTasks.length; i++) {
    const task = document.createElement('div');
    if (allTasks[i].isCompleted) task.className = 'task done';
    else task.className = 'task';
    task.dataset.id = allTasks[i].id;
    fragment.append(task);

    const para = document.createElement('p');
    para.className = 'task-content';
    para.textContent = allTasks[i].content;

    const controls = document.createElement('div');
    controls.className = 'controls';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = allTasks[i].id;
    if (allTasks[i].isCompleted) checkbox.checked = true;
    checkbox.addEventListener('change', toggleTaskStatus);

    const label = document.createElement('label');
    label.setAttribute('for', allTasks[i].id);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-task';
    deleteButton.innerHTML = 'Delete <i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener('click', deleteTask);

    controls.append(checkbox, label, deleteButton);
    task.append(para, controls);
  }
  tasksContainer.append(fragment);
}

function setTask(event) {
  event.preventDefault();

  const contentInput = this.elements['content'];
  let contentValue = contentInput.value;
  if (contentValue === '') return;
  contentInput.value = '';

  const task = {
    id: Date.now(),
    content: contentValue,
    isCompleted: false,
  };
  allTasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(allTasks));

  createTaskElements();
}

function getTasks() {
  allTasks = JSON.parse(localStorage.getItem('tasks'));

  if (allTasks.length) createTaskElements();
  else createEmptyElement();
}

taskForm.addEventListener('submit', setTask);

function getCurrentYear() {
  const footerYear = document.getElementById('year');
  footerYear.textContent = new Date().getFullYear();
}
getCurrentYear();
