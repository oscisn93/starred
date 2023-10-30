import "./index.css";
import { userService } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
// http://reactcommunity.org/react-modal/
import Modal from "react-modal";
import TaskComponent from "../../components/TaskComponent";
// images and assets
import kidFace2 from "../../assets/kidFace1.png";
import kidFace3 from "../../assets/kidFace2.png";
import kidFace4 from "../../assets/kidFace3.png";
import taskIcon1 from "../../assets/taskIcon1.png";
import taskIcon2 from "../../assets/taskIcon2.png";
import taskIcon3 from "../../assets/taskIcon3.png";
import banner from "../../assets/bannerImage.jpg";
import childrenBanner from "../../assets/childBannerImage.png";
import rectangle from "../../assets/rectangle.png";
import dashboardIcon from "../../assets/dashboardIcon.svg";

// dummy data
const goals = [
  {
    title: "Learn to code",
    description: "Six figure salary here I come!",
    tasks: [
      {
        title: "take Intro to CS",
        description: "Learn the basics of programming",
        dueDate: "10/22/2023",
        points: 100,
        completed: false,
      },
    ],
  },
  {
    title: "Get swole",
    description: "Make Arnold proud",
    tasks: [
      {
        title: "First workout",
        description: "Do 10 pushups",
        dueDate: "10/22/2023",
        points: 10,
        completed: false,
      },
    ],
  },
];

const tasks = [
  {
    title: "Clean room",
    description: "Make bed, put away toys, and vacuum",
    dueDate: "10/22/2023",
    points: 30,
    completed: false,
  },
  {
    title: "Take a walk",
    description: "Take a walk around the block",
    dueDate: "10/22/2023",
    points: 20,
    completed: false,
  },
  {
    title: "Task 3",
    description: "Description",
    dueDate: "10/22/2023",
    points: 10,
    completed: false,
  },
];
// task icons array
const taskIcons = [taskIcon1, taskIcon2, taskIcon3];
// modal sytles
const customStyles = {
  content: {
    width: "20%",
    height: "40%",
    margin: "auto",
  },
};

const Home = () => {
  const navigate = useNavigate();
  // modal state
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalItem, setItem] = useState(null);
  // modal handlers
  function openModal() {
    setIsOpen(true);
  }
  // set item null when closed
  function closeModal() {
    setIsOpen(false);
    // need to use a timeout to allow the modal
    // to close before setting the item to null
    setTimeout(() => {
      setItem(null);
    }, 100);
  }
  // sign out user
  function handleSignOut() {
    userService.signOutUser();
    navigate("/");
  }

  // Placeholder function, will fix this once funcitonality is implemented
  // @ts-ignore
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("Enter Key Pressed");
    }
  };

  const today = new Date();

  return (
    <div className="main-content">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="profile">
        <img src={kidFace3} alt="Profile" className="profile-image" />
      </div>

      <div className="vertical-container">
        <div className="btn-column-container">
          <Link to="/home">Home</Link>
          <Link to="/home">Calendar</Link>
          <Link to="/task">Tasks</Link>
          <Link to="/home">Information</Link>
        </div>
        <div className="component">
          <div className="dashboard-image-container">
            <img
              className="dashboard-image"
              src={dashboardIcon}
              alt="Dashboard Icon"
            ></img>
            <div className="overlay-rectangle"></div>
          </div>
          <img className="dashboard-background" src={rectangle}></img>
          <button className="logout-button" onClick={handleSignOut}>
            Log Out
          </button>
        </div>
      </div>

      <div className="row-container">
        <div className="component">
          <div className="welcome-container">
            <img src={banner} className="banner-background"></img>
            <div className="introduction">
              <span className="date">{today.toDateString()}</span>
              <h3 className="welcome-title">
                Welcome Back, Child1!
                <p className="subtitle">Getting tasks done!</p>
              </h3>
            </div>
            <img src={childrenBanner} className="child-banner"></img>
          </div>
        </div>
      </div>

      <div className="row-container">
        <div className="component">
          <h1>Tasks</h1>
          <div className="task-list-container">
            {tasks.map((task, index) => (
              <div key={index} className="task-item">
                <img
                  src={taskIcons[index]}
                  className="task-item-image"
                  onClick={() => {
                    setItem(task);
                    openModal();
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="component">
          <h1 id="guardians-title">Guardians</h1>
          <div className="guardians-container">
            <div className="guardian-item">
              <img src={kidFace2} className="guardian-image"></img>
              <h4>Mom</h4>
            </div>
            <div className="guardian-item">
              <img src={kidFace3} className="guardian-image"></img>
              <h4>Dad</h4>
            </div>
            <div className="guardian-item">
              <img src={kidFace4} className="guardian-image"></img>
              <h4>Uncle Bob</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row-container">
        <div className="component">
          <h1 id="progress-title">Rewards</h1>
          <a className="see-more-link-large">See More</a>
          <div className="task-in-progress-container">
            {taskIcons.map((taskIcon, _index) => (
              <div className="task-item-in-progress">
                <img
                  src={taskIcon}
                  className="task-item-in-progress-image"
                ></img>
              </div>
            ))}
          </div>
        </div>

        <div className="component">
          <div className="parent-container">
            <h1>Goals</h1>
            <div className="upcoming-tasks-container">
              {goals.map((goal, index) => (
                <div className="upcoming-task-item">
                  Goal: {index + 1}
                  <div className="upcoming-task-title">{goal.title}</div>
                  <div className="upcoming-task-description">
                    {goal.description}
                  </div>
                  <a className="see-more-link">See Tasks for this goal</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Task Modal"
      >
        <TaskComponent task={modalItem} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default Home;
