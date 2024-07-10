import React from "react";

const Delete = ({ id, deleteTask }) => {
  const eliminar = () => {
    deleteTask(id);
  };

  return (
    <span className="delete-icon" onClick={eliminar}>❌</span>
  );
};

export default Delete;
