import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const actionMapping: { [key: string]: string } = {
  pizzaLogged: "Pizza eaten",
  pizzaBought: "Pizza bought",
};

const Manage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pizzaHistory, setPizzaHistory] = useState<any>(null);
  const [pizzaCost, setPizzaCost] = useState<number>(2);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchConstants();
  }, []);

  const fetchConstants = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/getConfigs');
      const { pizzaCost } = response.data;
      setPizzaCost(pizzaCost);
    } catch (error) {
      alert('Failed to fetch pizza cost.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/getUsers');
      setUsers(response.data.users);
    } catch (error) {
      alert('Error fetching users.');
      setUsers([]);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/deleteUser/${userId}`);
      fetchUsers();
    } catch (error) {
      alert('Error deleting user.');
    }
  };

  const fetchUserPendingCoins = async (userId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/getUserCoins/${userId}`);
      return response.data.balance;
    } catch (error) {
      alert('Error fetching pending coins.');
      return 0;
    }
  };

  const fetchPizzaAvailableForLogging = async (userId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/getAvailablePizzasForLogging/${userId}`);
      return response.data.availableToLog;
    } catch (error) {
      alert('Error fetching pizza availability.');
      return 0;
    }
  };

  const buyPizza = async (userId: string, numberOfPizzas: number) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/buyPizza', {
        userId,
        numberOfPizzas,
      });
      alert('Pizza purchased successfully!');
      fetchUsers();
    } catch (error) {
      alert('Error buying pizza.');
    }
  };

  const logPizza = async (userId: string, numberOfPizzas: number) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/logPizza', {
        userId,
        numberOfPizzas,
      });
      alert('Pizza logged successfully!');
      fetchUsers();
    } catch (error) {
      alert('Error logging pizza.');
    }
  };

  const fetchPizzaHistory = async (userId: string) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/getTransactionsByFilter`, {
        userId,
      });
      console.log(response.data);
      setPizzaHistory(response.data);
    } catch (error) {
      alert('Error fetching pizza history.');
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <div className="manage-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.userId}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>
                  <button onClick={() => navigate(`/users?userId=${user.userId}`)}>Edit</button>
                  <button onClick={() => setSelectedUser({id: user.userId, name: user.name, type: 'delete'})}>
                    Delete
                  </button>
                  <button
                    onClick={async () => {
                      const pendingCoins = await fetchUserPendingCoins(user.userId);
                      setSelectedUser({ id: user.userId, name: user.name, pendingCoins, type: 'buy' });
                    }}
                  >
                    Buy Pizza
                  </button>
                  <button
                    onClick={async () => {
                      const availablePizzas = await fetchPizzaAvailableForLogging(user.userId);
                      setSelectedUser({ id: user.userId, name: user.name, availablePizzas, type: 'log' });
                    }}
                  >
                    Log Pizza
                  </button>
                  <button onClick={() => fetchPizzaHistory(user.userId)}>Pizza History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete User Pop-up*/}
        {selectedUser && selectedUser.type == 'delete' && (
          <div className="popup">
            <div className="popup-inner">
              <h2>Delete {selectedUser.name}'s User</h2>
              <button
                onClick={() => {
                  deleteUser(selectedUser.id);
                  setSelectedUser(null);
                }}
              >
                Confirm Deletion
              </button>
              <button onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Buy Pizza Pop-up */}
        {selectedUser && selectedUser.type == 'buy' && (
          <div className="popup">
            <div className="popup-inner">
              <h2>Buy Pizza for {selectedUser.name}</h2>
              <p>Cost per pizza: {pizzaCost} coins</p>
              <p>Coin Balance: {selectedUser.pendingCoins}</p>
              <label htmlFor="numberOfPizzas">Number of Pizzas:</label>
              <input
                type="number"
                id="numberOfPizzas"
                min="1"
                onChange={(e) => setSelectedUser({ ...selectedUser, pizzas: +e.target.value })}
              />
              <button
                onClick={() => {
                  buyPizza(selectedUser.id, selectedUser.pizzas);
                  setSelectedUser(null);
                }}
              >
                Confirm Purchase
              </button>
              <button onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Log Pizza Pop-up */}
        {selectedUser && selectedUser.type === 'log' && (
          <div className="popup">
            <div className="popup-inner">
              <h2>Log Pizza for {selectedUser.name}</h2>
              <p>Available Pizzas: {selectedUser.availablePizzas}</p>
              <label htmlFor="numberOfPizzas">Number of Pizzas:</label>
              <input
                type="number"
                id="numberOfPizzas"
                min="1"
                onChange={(e) => setSelectedUser({ ...selectedUser, pizzas: +e.target.value })}
              />
              <button
                onClick={() => {
                  logPizza(selectedUser.id, selectedUser.pizzas);
                  setSelectedUser(null);
                }}
              >
                Log Pizza
              </button>
              <button onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Pizza History Pop-up */}
        {pizzaHistory && (
          <div className="popup">
            <div className="popup-inner">
              <h2>Pizza History</h2>
              <ul>
                {pizzaHistory.map((transaction: any) => (
                  <li key={transaction.transactionId}>
                    {transaction.numberOfPizzas} {actionMapping[transaction.userAction]} on{' '}
                    {new Date(transaction.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
              <button onClick={() => setPizzaHistory(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <div className="home-container">
        <button className="home-button" onClick={() => navigate(`/`)}>
          Home
        </button>
      </div>
    </div>
  );
};

export default Manage;
