import "./index.css";
import React from "react";
import { signOutUser } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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


const Home = () => {
  const navigate = useNavigate();

  function handleSignOut() {
    signOutUser();
    navigate("/");
  }

  // Placeholder function, will fix this once funcitonality is implemented
  const handleKeyPress = (e) => { 
    if (e.key === 'Enter') {
      console.log('Enter Key Pressed');
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
        <Link to="/home">Home</Link>
        <div className="component">
          <div className="dashboard-image-container">
              <img className="dashboard-image" src={dashboardIcon} alt="Dashboard Icon"></img>
              <div className="overlay-rectangle"></div>
            </div>
          <img className="dashboard-background" src={rectangle}></img>
          <button className="logout-button" onClick={handleSignOut}>Log Out</button>
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
          <div className="task-list-container">
            <div className="task-item">
              <img src={taskIcon1} className="task-item-image"></img>
            </div>
            <div className="task-item">
              <img src={taskIcon2} className="task-item-image"></img>
            </div>
            <div className="task-item">
              <img src={taskIcon3} className="task-item-image"></img>
            </div>
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
              <img src={taskIcon1} className="task-item-in-progress-image"></img>
            </div>
            <div className="task-item-in-progress">
              <img src={taskIcon2} className="task-item-in-progress-image"></img>
            </div>
            <div className="task-item-in-progress">
              <img src={taskIcon3} className="task-item-in-progress-image"></img>
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
          
    </div>
  );
};

export default Home;
