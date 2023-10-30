import "./index.css";
import { userService } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import TaskComponent from "../../components/TaskComponent";

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

const tasks = [
  {
    title: "Task 1",
    description: "Description",
    dueDate: "10/22/2023",
    points: 10,
    completed: false,
  },
  {
    title: "Task 2",
    description: "Description",
    dueDate: "10/22/2023",
    points: 10,
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

const taskIcons = [taskIcon1, taskIcon2, taskIcon3];

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
          <Link to="/playground">Tasks</Link>
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
              <p className="date">October 22, 2023</p>
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
          <Link to="/task" className="add-task-button">
              Add Task
            </Link>
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
              <h4>Guardian 3</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row-container">
        <div className="component">
          <h1 id="progress-title">In Progress Tasks</h1>
          <a className="see-more-link-large">See More</a>
          <div className="task-in-progress-container">
            <div className="task-item-in-progress">
              <img
                src={taskIcon1}
                className="task-item-in-progress-image"
              ></img>
            </div>
            <div className="task-item-in-progress">
              <img
                src={taskIcon2}
                className="task-item-in-progress-image"
              ></img>
            </div>
            <div className="task-item-in-progress">
              <img
                src={taskIcon3}
                className="task-item-in-progress-image"
              ></img>
            </div>
          </div>
        </div>

        <div className="component">
          <div className="parent-container">
            <h1>Upcoming Tasks</h1>
            <div className="upcoming-tasks-container">
              <div className="upcoming-task-item">
                Upcoming Task 1
                <div className="upcoming-task-title">Fold Clothes</div>
                <div className="upcoming-task-description">Description</div>
                <a className="see-more-link">See More</a>
              </div>
              <div className="upcoming-task-item">
                Upcoming Task 2
                <div className="upcoming-task-title">Take Trash Out</div>
                <div className="upcoming-task-description">Description</div>
                <a className="see-more-link">See More</a>
              </div>
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
