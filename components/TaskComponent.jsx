// @ts-nocheck
// import "TaskComponent.css";
import Modal from "react-modal";
import { useState } from "react";
import "../pages/home-page/index.css";



Modal.setAppElement("#root");

export default function TaskComponent({ task, closeModal }) {
  return (
    <div>
      <button onClick={closeModal}>X</button>
      <h1>Task Infomation</h1>
      <section>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <aside>
          <p>Due Date: {task.dueDate}</p>
          <p>Points: {task.points}</p>
          <p>Completed: {task.completed ? "Complete" : "Incomplete"}</p>
        </aside>
      </section>
      <span className="edit">Edit</span>
    </div>
  );
}
