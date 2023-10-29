import { useReducer } from "react";
import { auth, taskService } from "../services/firebase";
import { Timestamp } from "firebase/firestore";

// @ts-ignore
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

export default function Playground() {
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
  // @ts-ignore
  function handleInputChange(e) {
    // @ts-ignore
    dispatch({ type: e.target.name, payload: e.target.value });
  }
  // @ts-ignore
  function handleUpdate(e) {
    e.preventDefault();
    taskService.addTask(state);
  }

  return (
    <main>
      <h1>Task Form</h1>
      <section>
        <h2>{state.title}</h2>
        <p>{state.description}</p>
        <aside>
          <p>Due Date: {state.dueDate}</p>
          <p>Points: {state.points}</p>
          <p>Completed: {state.completed ? "Complete" : "Incomplete"}</p>
        </aside>
      </section>
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={state.title}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
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
            id="dueDate"
            value={state.dueDate}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="points">Points</label>
          <input
            type="number"
            name="points"
            id="points"
            value={state.points}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="completed">Completed</label>
          <input
            type="checkbox"
            name="completed"
            id="completed"
            value={state.completed}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label htmlFor="goalID">Goal</label>
          <input
            type="text"
            name="goalID"
            id="goalID"
            value={state.goalID}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <input id="task-update-button" name="task-update" type="button" value="Update" onClick={handleUpdate} />
      </form>
    </main>
  );
}
