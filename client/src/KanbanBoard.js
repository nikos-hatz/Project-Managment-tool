import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const KanbanBoard = ({ tasks, updateTaskStatus }) => {
    const statuses = ["Todo", "InProgress", "Completed"];

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    console.log("Full drag result:", result);

    if (!destination) {
      console.log("Dropped outside a droppable area.");
      return;
    }

    console.log("Source ID:", source.droppableId);
    console.log("Destination ID:", destination.droppableId);

    if (source.droppableId === destination.droppableId) {
      console.log("No status change.");
      return;
    }

    // Ensure the status matches exactly
    updateTaskStatus(draggableId, destination.droppableId);
  };

  // Group tasks by status, ensuring consistent status naming
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      // Normalize status to match the statuses array
      const normalizedStatus = task.status === "To Do" ? "Todo" : 
                                task.status === "In Progress" ? "InProgress" : 
                                task.status;
      
      if (!acc[normalizedStatus]) acc[normalizedStatus] = [];
      acc[normalizedStatus].push(task);
      return acc;
    },
    { 
      "Todo": [], 
      "InProgress": [], 
      "Completed": [] 
    }
  );
  
  console.log("Grouped Tasks:", groupedTasks);
  console.log("Tasks:", tasks);
tasks.forEach((task) => console.log("Task ID:", task.id));

  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px" }}>
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                width: "30%",
                minHeight: "200px",
                border: "1px solid #ccc",
                padding: "10px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <h3>{status}</h3>
              {groupedTasks[status]?.map((task, index) => (
                <Draggable draggableId={task.id} index={index} key={task.id}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: "10px",
                        padding: "10px",
                        background: "#f9f9f9",
                        border: "1px solid #ddd",
                      }}
                    >
                      <strong>{task.name}</strong>
                      <p>{task.description}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        ))}
      </div>
    </DragDropContext>
  );
  
};

export default KanbanBoard;
