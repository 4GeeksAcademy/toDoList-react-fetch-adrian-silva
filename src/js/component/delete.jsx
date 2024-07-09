import React from "react";

const Delete = ({ taskKey, tasksList, setTasksList }) => {
    const eliminar = () => {
        const newTasksList = tasksList.filter((_, index) => index !== taskKey);
        setTasksList(newTasksList);
    }

    return (
        <span className="delete-icon" onClick={eliminar}>❌</span>
    )
}

export default Delete;