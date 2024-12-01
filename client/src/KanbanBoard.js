import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const KanbanBoard = ({ tasks, updateTaskStatus }) => {
  const statuses = ["To Do", "In Progress", "Completed"];

  const onDragEnd = (result) => {
    console.log("Drag result:", result);
    const { source, destination, draggableId } = result;
  
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
  
    // Update task status
    updateTaskStatus(draggableId, destination.droppableId);
  };
  

  // Group tasks by status
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    },
    { "To Do": [], "In Progress": [], "Completed": [] } // Default groups
  );
  statuses.forEach((status) => {
    console.log(`Droppable for ${status}:`, groupedTasks[status]);
  });
  
  

//   console.log("Grouped Tasks:", groupedTasks);
//   console.log("Tasks prop:", tasks);
//   groupedTasks['To Do'].map((task, index) => (console.log('tt',task, index)))
//   console.log('Statuses', statuses)
console.log("Tasks:", tasks);
console.log("Statuses:", statuses);
console.log("Grouped Tasks:", groupedTasks);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px" }}>
      {statuses.map((status) => {
  console.log(`Rendering Droppable for ${status}`);
  return (
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
          }}
        >
          <h3>{status}</h3>
          {groupedTasks[status].map((task, index) => (
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
  );
})};

        
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
