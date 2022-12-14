let ul = document.getElementById('todo-list');
let textboxTodo = document.getElementById('textbox-todo');
let form = document.getElementById('form-todo');
let checkboxes = document.querySelectorAll('#todo-list input');

const addTodoClient = (id, texte, estCoche) => {
    let li = document.createElement('li');

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = estCoche;
    input.dataset.id = id;
    input.addEventListener('change', checkTodoServeur);
    li.append(input);

    let div = document.createElement('div');
    div.classList.add('text');
    div.innerText = texte
    li.append(div);

    ul.append(li);
}

const checkTodoServeur = (event) => {
    let data = {
        id: event.currentTarget.dataset.id
    }

    fetch('/api/todo', {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
}

const addTodoServeur = async (event) => {
    event.preventDefault();

    let data = {
        texte: textboxTodo.value
    }

    let response = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        let data = await response.json();
        addTodoClient(data.id, textboxTodo.value, false);
        textboxTodo.value = '';
        textboxTodo.focus();
    }
}

form.addEventListener('submit', addTodoServeur);

for(let checkbox of checkboxes) {
    checkbox.addEventListener('change', checkTodoServeur)
}
