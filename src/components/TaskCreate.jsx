// @ts-nocheck
import { useReducer } from "react";
import { auth, taskService } from "../services/firebase";
import { Timestamp } from "firebase/firestore";

function reducer(state, action) {
  switch (action.type) {
    case "title":
      return { ...state, title: action.payload, updatedAt: Timestamp.now() };
    case "description":
      return {
        ...state,
        description: action.payload,
        updatedAt: Timestamp.now(),
      };
    case "dueDate":
      return { ...state, dueDate: action.payload, updatedAt: Timestamp.now() };
    case "points":
      return { ...state, points: action.payload, updatedAt: Timestamp.now() };
    case "completed":
      return {
        ...state,
        completed: action.payload,
        updatedAt: Timestamp.now(),
      };
    case "goalID":
      return { ...state, goalID: action.payload, updatedAt: Timestamp.now() };
    default:
      return state;
  }
}

export default function TaskCreate() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("401: User is not logged in");
  }

  const [state, dispatch] = useReducer(reducer, {
    userID: user.uid,
    creatorID: user.uid,
    guardianID: "",
    taskID: "",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    title: "Task Title",
    description: "",
    completed: false,
    dueDate: "",
    points: 0,
    goalID: "None",
  });

  function handleInputChange(e) {
    dispatch({ type: e.target.name, payload: e.target.value });
  }

  function handleUpdate(e) {
    e.preventDefault();
    taskService.addTask(state);
  }

  return (
    <main>
      <h1>Task Form</h1>
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="task-title"
            value={state.title}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="task-description"
            cols={25}
            value={state.description}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="task-dueDate"
            value={state.dueDate}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="points">Points</label>
          <input
            type="number"
            name="points"
            id="task-points"
            value={state.points}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="completed">Completed</label>
          <input
            type="checkbox"
            name="completed"
            id="task-completed"
            value={state.completed}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="goalID">Goal</label>
          <input
            type="text"
            name="goalID"
            id="task-goalID"
            value={state.goalID}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <input type="button" value="Update" onClick={handleUpdate} />
      </form>
    </main>
  );
}
