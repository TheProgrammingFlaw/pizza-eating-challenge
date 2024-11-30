import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// const POLLING_INTERVAL = 5000;

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {

    const socket = io('http://127.0.0.1:5000', {
      transports: ['websocket']
    });

    socket.on('user_update', () => {
      fetchUsers();
    });

    /*
    const intervalId = setInterval(fetchUsers, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
    */

    fetchUsers();

    return () => {
      socket.disconnect();
    };

  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/getUsers');
      setUsers(response.data.users);
    } catch (error) {
      alert('Error fetching users.');
      setUsers([]);
    }
  };

  return (
    <div>
      <h1>Leaderboard</h1>
      <div className="manage-container">
        <table className="users-table">
        <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Pizzas Eaten</th>
            </tr>
          </thead>
          <tbody>
            {users
            .sort((a,b) => b.totalPizzasLogged - a.totalPizzasLogged)
            .map((user: any, index: number) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.totalPizzasLogged}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="home-container">
        <button className="home-button" onClick={() => navigate(`/`)}>
          Home
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;