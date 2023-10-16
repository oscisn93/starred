import './index.css'

const Home = () => {

    return(
      <div className='main-content'>
        <h1>Hello from the home page</h1>

        <div className='component'>
          <div>placeholder for wesley</div>
        </div>

        <div className='component'>
          <div>placeholder for wesley</div>
        </div>

        <div className='component'>
          <div>placeholder for wesley</div>
        </div>

        <div className='row-container'>
          <div className='component'>
            <h1>Tasks</h1>
            <div className='task-list-container'>
              <div className='task-item'>Task 1</div>
              <div className='task-item'>Task 2</div>
              <div className='task-item'>Task 3</div>
              <div className='task-item'>Task 4</div>
            </div>
          </div>

          <div className='component'>
            <h1>Guardians</h1>
            <div className='guardians-container'>
              <div className='guardian-item'><h4>guardian 1</h4></div>
              <div className='guardian-item'><h4>guardian 2</h4></div>
              <div className='guardian-item'><h4>guardian 3</h4></div>
            </div>
          </div>
        </div>

        <div className='row-container'>
          <div className='component'>
            <h1>In Progress Tasks</h1>
            <div className='task-in-progress-container'>
              <div className='task-item-in-progress'>In Progress Task 1</div>
              <div className='task-item-in-progress'>In Progress Task 2</div>
              <div className='task-item-in-progress'>In Progress Task 3</div>
              <div className='task-item-in-progress'>In Progress Task 4</div>
            </div>
          </div>

          <div className='component'>
            <h1>Upcoming Tasks</h1>
            <div className='upcoming-tasks-container'>
              <div className='upcoming-task-item'>
                Upcoming Task 1
                <div className='upcoming-task-title'>Task #1</div>
                <div className='upcoming-task-description'>Description</div>
                <a className='see-more-link'>See More</a>
              </div>
              <div className='upcoming-task-item'>
                Upcoming Task 2
                <div className='upcoming-task-title'>Task #2</div>
                <div className='upcoming-task-description'>Description</div>
                <a className='see-more-link'>See More</a>
              </div>
            </div>
          </div>
        </div>


      </div>



    )
}

export default Home
