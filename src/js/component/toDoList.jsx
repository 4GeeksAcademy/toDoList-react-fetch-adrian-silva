import React, { useState } from "react";
import Task from "./task";

const ToDoList = () => {
  const [tasksList, setTasksList] = useState([])
  const [task, setTasks] = useState('')

  const addTasks = (e) => {
    if (e.key === 'Enter' && task !== '') {
      setTasksList([...tasksList, task])
      setTasks('')
    }
  }

  const readTask = (e) => {
    setTasks(e.target.value)
  }

  return (
    <div className="container col-6 mt-5">
      <h1 className="display-1 text-secondary text-center">todos</h1>
      <input className="form-control mb-1" type="text" placeholder="Add tasks" onChange={readTask} onKeyDown={addTasks} value={task} />
      <Task tasksList={tasksList} setTasksList={setTasksList} />
      <div className="items-left">
        {tasksList.length} item{tasksList.length !== 1 ? 's' : ''} left
      </div>
    </div>
  );
};

export default ToDoList;