const user_input = document.querySelector(".input_box");
const form = document.querySelector("form");
const list_tasks = document.querySelector(".tasks_box");
const add_button = document.querySelector(".add_button");
const rem_tasks = document.querySelector(".remaining_tasks");
const tip = document.querySelector(".tip");

const messages = [
  "У тебе вийде!",
  "По одному завданню за раз 💪",
  "Майбутнє «я» буде тобі вдячне",
  "Зроблено — краще, ніж ідеально"
];

const empty_messages = [
   "Тут нічого… підозрілого 👀",
   "Час придумати щось класне!"
];

let all_tasks = getTasks();
updateTaskList();

const jsConfetti = new JSConfetti();

function getRandomMessage(){
    if (all_tasks.length <= 0){
        tip.innerHTML = `<b>*Порада:</b> ${empty_messages[Math.floor(Math.random() * empty_messages.length)]}`;
    } else {
        tip.innerHTML = `<b>*Порада:</b> ${messages[Math.floor(Math.random() * messages.length)]}`;

    }
}

getRandomMessage();

function getTasks(){
    const tasks = localStorage.getItem("tasks") || "[]";
    return JSON.parse(tasks);
}

// user_input.addEventListener("input", ()=>{
//     if (user_input.value.length >= 20){
//         user_input.classList.add("char_limit");
//     } else {
//         user_input.classList.remove("char_limit");
//     }
// });

function capitalize(word){
    const first_letter = word[0].toUpperCase();
    return first_letter + word.slice(1);
}

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    
    if (user_input.value.length >= 20){
        user_input.value = "";
        user_input.classList.add("error_box");
        user_input.setAttribute("placeholder", "Обмеження: 20 символів! 😯"); 
        
        add_button.setAttribute("disabled", true);
        add_button.style.cursor = "default";
        user_input.setAttribute("disabled", true);

        const char_limit_err = new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 1000);
        }).then((result) => {
            add_button.removeAttribute("disabled");
            add_button.style.cursor = "pointer";
            user_input.removeAttribute("disabled");

            user_input.classList.remove("error_box");
            user_input.setAttribute("placeholder", "Введіть своє завдання тут...");
         }).catch((err) => {
            console.log(`There was an error: ${err}`);
         });

        return;
    } if (user_input.value.length === 0){
        user_input.value = "";
        user_input.classList.add("error_box");
        user_input.setAttribute("placeholder", "Напишіть хочаб щось 😒");

        add_button.setAttribute("disabled", true);
        add_button.style.cursor = "default";
        user_input.setAttribute("disabled", true);

        const empty_input_err = new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 1000);
        }).then((result) => {
            add_button.removeAttribute("disabled");
            add_button.style.cursor = "pointer";
            user_input.removeAttribute("disabled");

            user_input.classList.remove("error_box");
            user_input.setAttribute("placeholder", "Введіть своє завдання тут...");
         }).catch((err) => {
            console.log(`There was an error: ${err}`);
         });

        return;
    } else {
        user_input.classList.remove("error_box");
        user_input.setAttribute("placeholder", "Введіть своє завдання тут...");
    }
    
    const text_content = DOMPurify.sanitize(capitalize(user_input.value.trim()));
    addNewTask(text_content);
    user_input.value = '';
});

function addNewTask(text){
    const task_object = {
        value: text,
        completed: false
    }
    
    all_tasks.push(task_object);
    saveTasks();
    updateTaskList();
}

function updateTaskList(){
    list_tasks.innerHTML = '';

    all_tasks.forEach((task, taskIndex)=>{
        taskItem = createNewTask(task, taskIndex);
        list_tasks.append(taskItem);
    })

    calculate_remaining_tasks();
}

function calculate_remaining_tasks(){
    let completed_tasks = 0;

    all_tasks.forEach((task)=>{
        if (task.completed){
            completed_tasks++;
        }
    });
    
    rem_tasks.innerHTML = `${completed_tasks} із ${all_tasks.length} виконано`;
    getRandomMessage();
}

function createNewTask(task, taskIndex){
    const taskId = `check_input-${taskIndex}`;
    const taskLI = document.createElement('li');

    taskLI.classList.add("task", taskId);

    taskLI.innerHTML = `
        <input id="${taskId}" class="check_input" type="checkbox">
        <label class="check_button" for="${taskId}">
            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>
        </label>
        <p>${task.value}</p>
        <button class="delete_button">
            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>
        </button>
    `;

    const delete_button = taskLI.querySelector(".delete_button");
    delete_button.addEventListener("click", ()=>{
        deleteTaskItem(taskIndex, taskLI);
    });

    const check_button = taskLI.querySelector(".check_input");
    check_button.addEventListener("change", ()=>{
        all_tasks[taskIndex].completed = check_button.checked;
        allTasksDone();
        saveTasks();
        all_tasks = getTasks();
        calculate_remaining_tasks();
    });

    check_button.checked = all_tasks[taskIndex].completed;

    taskLI.classList.add("todo_appearing_effect");
    setTimeout(()=>{
        taskLI.classList.remove("todo_appearing_effect");
    }, 300);
    return taskLI;
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(all_tasks));
}

function move_tasks_effect(taskId) {
    [...list_tasks.children]
        .slice(taskId + 1)
        .forEach(task => {
            task.classList.add("move_task_effect");
            setTimeout(() => task.classList.remove("move_task_effect"), 400);
        });
}

function deleteTaskItem(taskId, task){
    const randomNumber = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    
    if (randomNumber === 1){
        task.classList.add("slide-out-left");
    } else {
        task.classList.add("slide-out-right");
    }

    move_tasks_effect(taskId);
    
    setTimeout(()=>{
        setTimeout(()=>{
            all_tasks = all_tasks.filter((_, index) => index !== taskId);
            saveTasks();
            updateTaskList();
        }, 100);
    }, 300);
}

function allTasksDone(){
    // let finished = false;

    // all_tasks.forEach((task, task_index)=>{
    //     if (task.completed) {
    //         finished = true;
    //     } else {
    //         finished = false;
    //         return;
    //     }
    // });

    let temp_counter = 0;
    let tasks_to_complete = all_tasks.length;

    all_tasks.forEach((task, task_index)=>{
        if (task.completed) {
            temp_counter++;
        }
    });


    if (temp_counter === tasks_to_complete){
        jsConfetti.addConfetti();
    }
}

