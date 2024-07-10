import React, { useState, useEffect } from "react";
import Task from "./task";
import Delete from "./delete";

const ToDoList = () => {
  const [tasksList, setTasksList] = useState([]);
  const [task, setTask] = useState('');
  const [userExists, setUserExists] = useState(false);

  // Defino el nombre de usuario
  const username = 'adrian-silva-uy';

  const getTodoList = () => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((response) => {
        if (response.status === 404) {
          error = 'User does not exist, you must create it'
          createUser()
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.todos) {
          setTasksList(data.todos); // Actualiza el estado con la lista de tareas completas
        }
      })
      .catch((error) => console.log('Error fetching tasks:', error));
  };

  const addTasks = (e) => {
    if (e.key === 'Enter' && task.trim() !== '') {
      const newTask = {
        label: task,
        is_done: false
      }; // No es necesario asignar id aquí

      fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          }
        })
        .then((data) => {
          // Actualiza tasksList con la nueva tarea devuelta por el servidor
          setTasksList([...tasksList, data]);
          getTodoList()
          setTask('');
        })
        .catch((error) => console.error('Error adding task:', error));
    }
  };

  const readTask = (e) => {
    setTask(e.target.value);
  };

  const deleteTask = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          let message;
          if (response.status === 404) {
            message = 'Task not found (404)';
          } else if (response.status === 422) {
            const errorData = await response.json();
            message = `Unprocessable Entity: ${JSON.stringify(errorData)}`;
          } else if (response.status === 500) {
            message = 'Server error (500)';
          } else {
            message = `Unexpected error: ${response.status}`;
          }
          throw new Error(message);
        }
        //si la respuesta es exitosa retorna mensaje exitoso o un objeto vacío
        return {};
      })
      .then((data) => {
        // Logueo mensaje exitoso y actualizo el estado
        console.log('Delete successful', data);
        // actualiza el estado filtrando la tarea eliminada
        setTasksList(tasksList.filter(task => task.id !== id));
        getTodoList();
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  const createUser = () => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "name": username })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "ok") {
          setUserExists(true);
          getTodoList();
        }
      })
      .catch((error) => console.log('Error creating user:', error));
  };

  const checkUserExists = () => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((response) => {
        if (response.ok) {
          setUserExists(true);
          getTodoList();
        } else {
          createUser();
        }
      })
      .catch((error) => console.log('Error checking user:', error));
  };

  const updateTask = (id, updatedTask) => {
    const response = fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return response.json()
            .then(errorData => {
              throw new Error(`Network response: ${response.status} - ${JSON.stringify(errorData)}`);
            });
        }
      })
      .then(data => {
        // Actualiza el estado tasksList con la task actualizada
        setTasksList(tasksList.map(task => task.id === id ? data : task));
        console.log('Task updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  useEffect(() => {
    checkUserExists();
  }, []); // La dependencia vacía me asegura que esto solo se ejecute una vez

  return (
    <div className="container col-6 mt-5">
      <h1 className="display-1 text-secondary text-center">todos</h1>
      {userExists && (
        <>
          <input
            className="form-control mb-1"
            type="text"
            placeholder="Add tasks"
            onChange={readTask}
            onKeyDown={addTasks} // Utiliza addTasks para manejar el evento onKeyDown
            value={task}
          />
          <ul className="list-group">
            {tasksList.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                {task.label}
                <Delete id={task.id} deleteTask={deleteTask} />
              </li>
            ))}
          </ul>
          <div className="items-left">
            {tasksList.length} item{tasksList.length !== 1 ? 's' : ''} left
          </div>
        </>
      )}
    </div>
  );
};

export default ToDoList;
