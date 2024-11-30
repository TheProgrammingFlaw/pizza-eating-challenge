import './Users.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserFormState } from './interfaces';
import { useNavigate, useLocation } from 'react-router-dom';
/*
** Direct Firebase connection **
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
*/

const Users: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<UserFormState>({
    name: '',
    age: '',
    gender: '',
  });

  const [error, setError] = useState<string | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const getQueryParam = (param: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const userId = getQueryParam('userId');
    if (userId) {
      setIsEditMode(true);
      fetchUserData(userId);
    }
  }, [location]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/getUser/${userId}`);
      const user = response.data.user;
      setFormData({
        name: user.name,
        age: user.age.toString(),
        gender: user.gender,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Name is required.');
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError('Name must contain only alphabets.');
      return;
    }

    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      setError('Age must be a positive number.');
      return;
    }

    if (!formData.gender) {
      setError('Gender is required.');
      return;
    }

    setError(null);

    try {
      if (isEditMode) {
        const userId = getQueryParam('userId');
        await axios.put(`http://127.0.0.1:5000/api/updateUser/${userId}`, {
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
        });
        alert('User updated successfully');
        navigate('/manage');
      } else {
        await axios.post('http://127.0.0.1:5000/api/createUser', {
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
        });
        alert('User created successfully');
      }

      setFormData({
        name: '',
        age: '',
        gender: '',
      });
    } catch (error) {
      setError('Failed to submit the form. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h1>User Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <br></br>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">Submit</button>
          <p></p>
        </form>
      </div>
      <div className="button-container">
        <button className="home-button" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    </div>
    );
};

export default Users;
