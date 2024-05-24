// Importing required modules
import React, { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import axios from "axios"; // Library for making HTTP requests
import "./App.css"; // CSS file for styling

// Main component function
function App() {
  // State variables using React hooks
  const [users, setUsers] = useState([]); // State variable to store all users
  const [filterUsers, setFilterUsers] = useState([]); // State variable to store filtered users
  const [isModalOpen, setIsModalOpen] = useState(false); // State variable to track if modal is open
  const [addUsers, setAddUsers] = useState({ name: "", age: "", city: "" }); // State variable to store data for adding new user

  // Function to fetch all users from the server
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data); // Set both users and filteredUsers state with fetched data
      setFilterUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error); // Log error if fetching users fails
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle search input change to filter users
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  // Delete user details
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete user?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers); // Update both users and filteredUsers state after deleting user
        setFilterUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error); // Log error if deleting user fails
      }
    }
  };

  // Close Modal
  const closemodal = () => {
    setIsModalOpen(false);
    getAllUsers(); // Refetch users after closing modal
  };

  // Add user details
  const handleAddRecord = () => {
    setAddUsers({ name: "", age: "", city: "" }); // Reset addUsers state
    setIsModalOpen(true); // Open modal
  };

  // Handle input change for adding user
  const handleData = (e) => {
    setAddUsers({ ...addUsers, [e.target.name]: e.target.value });
  };

  // Submit function for adding/editing user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addUsers.id) {
        // If user ID exists, it's an edit operation
        await axios.patch(
          `http://localhost:8000/users/${addUsers.id}`,
          addUsers
        );
      } else {
        // If user ID doesn't exist, it's an add operation
        await axios.post("http://localhost:8000/users/", addUsers);
      }
      closemodal(); // Close modal after adding/editing user
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If backend returns a 400 status code, display the warning message
        alert(error.response.data.message);
      } else {
        // Handle other errors
        console.error("Error adding/editing user:", error);
      }
    }
  };

  // Edit Record
  const handleUpdateRecord = (user) => {
    setAddUsers(user); // Set addUsers state with user data for editing
    setIsModalOpen(true); // Open modal for editing
  };

  // JSX to render UI
  return (
    <>
      <div className="container">
        {/* Header */}
        <h3>
          CRUD Application With React js as FrontEnd and Node js as Backend{" "}
        </h3>
        {/* Search input and Add Record button */}
        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here "
            onChange={handleSearchChange}
          />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        {/* User table */}
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through filteredUsers to render user data */}
            {filterUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td> {/* Serial number starts from 1 */}
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td>
                  {/* Button to edit user */}
                  <button
                    className="btn green"
                    onClick={() => handleUpdateRecord(user)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  {/* Button to delete user */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal for adding/editing user */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              {/* Close button */}
              <span className="close" onClick={closemodal}>
                &times;
              </span>
              <h2>User Record</h2>
              {/* Input fields for adding/editing user */}
              <div className="input-group">
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={addUsers.name}
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="name">Age </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={addUsers.age}
                  onChange={handleData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="name">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={addUsers.city}
                  onChange={handleData}
                />
              </div>
              {/* Button to submit form */}
              <button className="btn green" onClick={handleSubmit}>
                Add User
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App; // Exporting the component
