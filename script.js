// Selectors

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo")

//Event Listeners

todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

// Functions

function addTodo(event, todoTask = todoInput.value, toggleCompletedClass = false, saveRequired = true) {
    event.preventDefault();
    console.log("Adding Todo Item...");

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo")

    const newTodo = document.createElement("li")
    newTodo.classList.add("todo-item")
    newTodo.innerHTML = todoTask;
    todoDiv.appendChild(newTodo);

    if (toggleCompletedClass == true) {
        todoDiv.classList.toggle("completed");
        todoDiv.classList.add("slideInRight");
    }
    if (saveRequired == true) {
        saveLocalTodos(todoDiv);
    }

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-button");
    completeButton.innerHTML = `<i class = "fa fa-lg fa-check"></i>`;
    todoDiv.appendChild(completeButton);

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.innerHTML = `<i class = "fa fa-lg fa-trash"></i>`;
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);

    todoInput.value = "";
}


function deleteCheck(e) {
    const itemClicked = e.target;

    if (itemClicked.classList[0] === "trash-button") {
        const todoItem = itemClicked.parentElement;
        todoItem.classList.add("fall");
        removeLocalTodos(todoItem);
        todoItem.remove();
        // todoItem.addEventListener('transitionend', () => {
        //     console.log('2')
        //     todoItem.remove();
        // })

    }
    else if (itemClicked.classList[0] === "complete-button") {
        const todoItem = itemClicked.parentElement;
        todoItem.classList.toggle("completed");
        todoItem.classList.add("slideOutRight");
        todoItem.addEventListener('animationend', () => {
            const todoTask = todoItem.children[0].innerHTML;
            removeLocalTodos(todoItem)
            todoItem.remove();
            addTodo(event, todoTask, true);
        })
    }
}


function filterTodo(e) {
    const todos = todoList.childNodes;
    console.log(todos);
    todos.forEach((todo, index) => {
        if (index != 0) {
            switch (e.target.value) {
                case "all":
                    todo.style.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains("completed")) {
                        todo.style.display = "flex";
                    }
                    else {
                        todo.style.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (!todo.classList.contains("completed")) {
                        todo.style.display = "flex";
                    }
                    else {
                        todo.style.display = "none";
                    }
                    break;
            };
        }
    })
}

function returnLocalTodos(todoType) {
    let todos;
    if (localStorage.getItem(todoType) == null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem(todoType));
    }
    return todos;
}

function saveLocalTodos(todo) {
    let uncompletedTodos = returnLocalTodos("uncompleted")
    let completedTodos = returnLocalTodos("completed")

    if (todo.classList.contains("completed")) {
        completedTodos.push(todo.children[0].innerHTML);
    }
    else {
        uncompletedTodos.push(todo.children[0].innerHTML);
    }
    localStorage.setItem("uncompleted", JSON.stringify(uncompletedTodos));
    localStorage.setItem("completed", JSON.stringify(completedTodos));
}

function removeLocalTodos(todo) {

    let uncompletedTodos = returnLocalTodos("uncompleted")
    let completedTodos = returnLocalTodos("completed")
    console.log(uncompletedTodos)
    console.log(completedTodos)


    uncompRemovalIndex = uncompletedTodos.indexOf(todo.children[0].innerText);
    if (uncompRemovalIndex != -1) {
        uncompletedTodos.splice(uncompRemovalIndex, 1);
    }

    compRemovalIndex = completedTodos.indexOf(todo.children[0].innerText);
    if (compRemovalIndex != -1) {
        completedTodos.splice(compRemovalIndex, 1);
    }

    localStorage.setItem("uncompleted", JSON.stringify(uncompletedTodos));
    localStorage.setItem("completed", JSON.stringify(completedTodos));
}

function loadLocalTodos() {
    let uncompletedTodos = returnLocalTodos("uncompleted")
    let completedTodos = returnLocalTodos("completed")

    uncompletedTodos.forEach((todo) => {
        addTodo(event, todo, false, false)
    })
    completedTodos.forEach((todo) => {
        addTodo(event, todo, true, false)
    })
}