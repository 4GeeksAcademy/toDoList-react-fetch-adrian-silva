import React from "react";
import Delete from "./delete";


const Task = ({tasksList, setTasksList}) => {
    return (
        <ul className="list-group">
            {tasksList.map((element, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">{element}<Delete id={index} tasksList={tasksList} setTasksList={setTasksList}/></li>
            ))}
        </ul>
    )
}

export default Task;