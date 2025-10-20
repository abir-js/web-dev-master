const fs = require("fs");
const filePath = "./tasks.json";

const command = process.argv[2];
const argument = process.argv[3];

const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    const parsed = JSON.parse(dataJSON);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // If file doesn't exist or JSON is invalid, return empty list
    return [];
  }
};

const saveTask = (tasks) => {
  const dataJSON = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(filePath, dataJSON);
};

const addTask = (taskText) => {
  if (!taskText || !taskText.toString().trim()) {
    console.log("Please provide a non-empty task to add.");
    return;
  }

  const tasks = loadTasks();
  tasks.push({ task: taskText.toString().trim() });
  saveTask(tasks);
  console.log("Task added.");
};

const listTasks = () => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }
  tasks.forEach((taskObj, index) => {
    console.log(`${index + 1} - ${taskObj.task}`);
  });
};

const removeTask = (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    console.log("Please provide a valid task number to remove (positive integer).");
    return;
  }

  const tasks = loadTasks();

  if (id > tasks.length) {
    console.log(`No task at position ${id}. There are only ${tasks.length} task(s).`);
    return;
  }

  // splice returns an array of removed items
  const [removedTask] = tasks.splice(id - 1, 1);
  saveTask(tasks);                // <-- important: save the updated tasks array
  console.log("Removed:", removedTask.task);
};

// CLI command handling
if (command === "add") {
  addTask(argument);
} else if (command === "list") {
  listTasks();
} else if (command === "remove") {
  // parseInt may return NaN; do an explicit conversion + check
  const id = Number(argument);
  removeTask(id);
} else {
  console.log("Command not found. Use: add <task>, list, remove <task-number>");
}
