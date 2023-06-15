import React, { useState } from "react";
import { format, startOfWeek, addDays, isBefore, isSameDay } from "date-fns";
import "./Calendar.css"; // Import your CSS file for styling

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const handleAddTask = (date, event) => {
    const taskTitle = event.target.value;
    const currentDate = new Date();

    if (isBefore(date, currentDate) && !isSameDay(date, currentDate)) {
      return; // Do not create task on previous dates
    }

    const updatedTasks = {
      ...tasks,
      [date]: { title: taskTitle, completed: false },
    };
    setTasks(updatedTasks);
    event.target.value = ""; // Clear the input field

    const nextRowDate = addDays(date, 7);
    const taskExistsInNextRow = tasks[nextRowDate];

    // Check if the next row is empty
    if (!taskExistsInNextRow) {
      const updatedTasksNextRow = {
        ...updatedTasks,
        [nextRowDate]: { title: "", completed: false },
      };
      setTasks(updatedTasksNextRow);
    } else {
      // If the next row already has a task, find the next empty row
      let rowIndex = 1;
      while (tasks[addDays(date, rowIndex * 7)]) {
        rowIndex++;
      }
      const nextEmptyRowDate = addDays(date, rowIndex * 7);
      const updatedTasksNextEmptyRow = {
        ...updatedTasks,
        [nextEmptyRowDate]: { title: "", completed: false },
      };
      setTasks(updatedTasksNextEmptyRow);
    }
  };

  const handleCompleteTask = (date) => {
    const updatedTasks = { ...tasks };
    updatedTasks[date].completed = !updatedTasks[date].completed;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (date) => {
    const updatedTasks = { ...tasks };
    delete updatedTasks[date];
    setTasks(updatedTasks);
  };



  const renderCalendar = () => {
    const dates = [];
    const days = [];
    const startDate = weekStart;

    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const formattedDate = format(date, "d");
      const formattedDay = format(date, "EEEE");
      const isCurrentDate = isSameDay(date, currentDate);
      const dateCellClasses = isCurrentDate ? "current-date" : "";

      dates.push(<td key={i} className={dateCellClasses}>{formattedDate}</td>);
      days.push(<td key={i}>{formattedDay}</td>);
    }

    const rows = [];
    for (let i = 0; i < 10; i++) {
      const emptyBoxes = Array(7)
        .fill(null)
        .map((_, index) => {
          const date = addDays(startDate, index);
          const task = tasks[date];

          if (i === 0 ) {
            if (task) {
              return (
                <td key={index}>
                  <div
                    style={{ display: "flex" }}
                    className={`task-text ${task.completed ? "completed" : ""}`}
                    onClick={() => handleCompleteTask(date)}
                  >
                    <span
                      style={{
                        color: "green",
                        padding: "2px",
                        borderRadius: "50%",
                        border: "1px solid green",
                      }}
                    >
                      ✔
                    </span>
                    {task.title}
                    <button
                      className="delete-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteTask(date);
                      }}
                    >
                      X
                    </button>
                  </div>
                </td>
              );
            } else {
              return (
                <td key={index}>
                  <div style={{ display: "flex" }}>
                    <input
                      className="item-input"
                      type="text"
                      placeholder="Add item"
                      onBlur={(event) => handleAddTask(date, event)}
                    />
                  </div>
                </td>
              );
            }
          } else if (i === 1 && tasks[addDays(startDate, index)]) {
            // Check if the next row already has a task
            return (
              <td key={index}>
                <div style={{ display: "flex" }}>
                  <input
                    className="item-input"
                    type="text"
                    placeholder="Add item"
                    onBlur={(event) => handleAddTask(date, event)}
                  />
                </div>
              </td>
            );
          } else {
            return <td key={index}></td>;
          }
        });
      rows.push(<tr key={i}>{emptyBoxes}</tr>);
    }

    return (
      <>
        <tr>{dates}</tr>
        <tr>{days}</tr>
        {rows}
      </>
    );
  };


  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(addDays(currentDate, -7))}>
          Previous Week
        </button>
        <h2>{format(weekStart, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentDate(addDays(currentDate, 7))}>
          Next Week
        </button>
      </div>
      <div className="calendar-body">
        <table className="calendar-table">
          <tbody>{renderCalendar()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;