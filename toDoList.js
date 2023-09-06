const inputBox = document.getElementById("InputBox");
const listContainer = document.getElementById("listContainer");
//После обновления показывается список из хранилища
window.onload = function () {
  showListTasks();
};
//
function addTask() {
  if (inputBox.value === "") {
    alert("Вы должны написать название задачи!");
  } else {
    let li = document.createElement("li");
    let taskText = document.createElement("span");
    taskText.textContent = inputBox.value;
    li.appendChild(taskText);
    listContainer.insertBefore(li, listContainer.firstChild);

    // Кнопка завершения задания
    let btnComplete = document.createElement("button");
    li.appendChild(btnComplete);
    btnComplete.className = "CompleteItemButton";
    btnComplete.textContent = "Завершено";

    // Обработчик события для завершения задания
    btnComplete.addEventListener("click", function () {
      li.classList.toggle("Checked");
      taskText.classList.toggle("Checked");

      saveTasks();

      const allTasksCompleted = checkAllTasksCompleted();

      // Если все задачи завершены, перемещаем их вниз списка
      if (allTasksCompleted) {
        reorderCompletedTasksToBottom();
      }
    });

    // Кнопка удаления элемента списка
    let btnDelete = document.createElement("button");
    li.appendChild(btnDelete);
    btnDelete.className = "DeleteItemButton";
    btnDelete.textContent = "Удалить";

    // Обработчик события для удаления задания
    btnDelete.addEventListener("click", function () {
      li.remove();

      saveTasks();
    });

    inputBox.value = "";
    listContainer.appendChild(li);

    saveTasks();
    showListTasks();
  }
}

//Выделение четных элементов цветом
function ColorEven() {
  let listItems = listContainer.querySelectorAll("li");
  listItems.forEach((item, index) => {
    if (index % 2 === 1) {
      if (!item.classList.contains("Even")) {
        item.classList.add("Even");
      } else {
        item.classList.remove("Even");
      }
    }
  });
  saveTasks();
}

//Выделение нечетных элементов цветом
function ColorUneven() {
  let listItems = listContainer.querySelectorAll("li");
  listItems.forEach((item, index) => {
    if (index % 2 === 0) {
      if (!item.classList.contains("Uneven")) {
        item.classList.add("Uneven");
      } else {
        item.classList.remove("Uneven");
      }
    }

    saveTasks();
  });
}
//Удаление первого элемента списка
function deleteFirstItem() {
  let firstItem = document
    .getElementsByTagName("ul")[0]
    .getElementsByTagName("li")[0];
  firstItem.remove();

  saveTasks();
}
///Удаление последнего элемента списка
function deleteLastItem() {
  let ContainerUL = document.getElementsByTagName("ul")[0];
  LastItem = ContainerUL.lastChild;
  LastItem.remove();

  saveTasks();
}
//Удаление элемента
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.className === "DeleteItemButton") {
      e.target.parentElement.remove();

      saveTasks();

      showListTasks();
    }
  },
  false
);

/*local storage*/

// При любом изменении списка вызывать saveTasks()
function saveTasks() {
  localStorage.setItem("data", listContainer.innerHTML);
  reorderCompletedTasksToBottom();
}

function showListTasks() {
  const savedData = localStorage.getItem("data");

  if (savedData) {
    listContainer.innerHTML = savedData;

    const completedTasks = listContainer.querySelectorAll(".Checked");

    completedTasks.forEach((task) => {
      const text = task.querySelector("span");
      if (text) {
        text.classList.add("Checked");
      }
    });

    // Добавляем обработчики событий для кнопок "Завершено"
    const completeButtons = listContainer.querySelectorAll(
      ".CompleteItemButton"
    );
    completeButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const li = btn.parentElement;
        li.classList.toggle("Checked");

        const taskText = li.querySelector("span");
        if (taskText) {
          taskText.classList.toggle("Checked");
        }
        saveTasks();
      });
    });
  }
}
//синхронизация изменений между вкладками
window.addEventListener("storage", function (e) {
  if (e.key === "data") {
    showListTasks();
  }
});
//завершенные задачи в конец списка
function reorderCompletedTasksToBottom() {
  const listItems = listContainer.querySelectorAll("li");
  const completedItems = [];
  const uncompletedItems = [];

  listItems.forEach((item) => {
    if (item.classList.contains("Checked")) {
      completedItems.push(item);
    } else {
      uncompletedItems.push(item);
    }
  });

  listContainer.innerHTML = "";

  uncompletedItems.forEach((item) => {
    listContainer.appendChild(item);
  });

  completedItems.forEach((item) => {
    listContainer.appendChild(item);
  });
  saveTasks();
  showListTasks();
}
