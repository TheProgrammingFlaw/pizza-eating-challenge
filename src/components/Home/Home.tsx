import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to the Unique Pizza Eating Challenge!</h1>
      <br></br>
      <div className="manage-container">
        <table className="home-table">
          <thead>
            <th>
              <button onClick={() => navigate('/users')}>Users</button>
            </th>
            <th>
              <button onClick={() => navigate('/manage')}>Manage</button>
            </th>
            <th>
              <button onClick={() => navigate('/leaderboard')}>Leader Board</button>
            </th>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Home;
