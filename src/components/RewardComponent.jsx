// @ts-nocheck
// import "TaskComponent.css";
import "../pages/home-page/index.css";
import { Link } from "react-router-dom";

export default function RewardComponent({ reward, closeModal }) {
  return (
    <div>
      <button onClick={closeModal}>X</button>
      <h1>Task Infomation</h1>
      <section>
        <h2>{reward.name}</h2>
        <p>{reward.description}</p>
        <aside>
          <p>Price: {reward.dueDate}</p>
          <p>Points: {reward.points}</p>
          <Link to={reward.url}>Buy</Link>
          <p>Approved: {reward.approved ? "Complete" : "Incomplete"}</p>
          <p>Earned: {reward.earned? "Earned": "Work in progress"}</p>
        </aside>
      </section>
      <span className="edit">Edit</span>
    </div>
  );
}
