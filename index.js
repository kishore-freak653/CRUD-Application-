// Importing required modules
const express = require("express"); // Express.js framework for handling HTTP requests
const users = require("./Sample.json"); // Sample user data loaded from a JSON file
const app = express(); // Creating an instance of the Express application
app.use(express.json()); // Middleware to parse JSON data from requests
const port = 8000; // Port number the server will listen on
const cors = require("cors"); // Middleware for enabling Cross-Origin Resource Sharing (CORS)
const fs = require("fs"); // Node.js module for file system operations

// Configuring CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allowing requests from this origin
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allowing these HTTP methods
  })
);

// Route to display all users
app.get("/users", (req, res) => {
  return res.json(users); // Respond with the list of users
});

// Route to delete a user by ID
app.delete("/users/:id", (req, res) => {
  let id = Number(req.params.id); // Extracting the user ID from the request parameters
  let filteredUsers = users.filter((user) => user.id !== id); // Filtering out the user with the specified ID
  fs.writeFile("./Sample.json", JSON.stringify(filteredUsers), (err, data) => { // Writing the updated user data to the JSON file
    return res.json(filteredUsers); // Responding with the updated list of users
  });
});

// Route to add a new user
app.post("/users", (req, res) => {
  let { name, age, city } = req.body; // Extracting user data from the request body

  // Check if all fields are provided
  if (!name || !age || !city) {
    return res.status(400).send({ message: "All fields are required" }); // Respond with an error message if any field is missing
  }

  // Check if the user already exists
 
  const existingUser = users.find(
    (user) => user.name === name && user.age === age && user.city === city
  );
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" }); // Respond with an error message if the user already exists
  }

  // Find the maximum ID in the existing users
  const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);

  // Increment the max ID to generate a new sequential ID
  const id = maxId + 1;

  // Add the new user with the generated ID
  users.push({ id, name, age, city });

  // Write the updated users array to the JSON file
  fs.writeFile("./Sample.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Error writing file" }); // Respond with an error message if there's an error writing the file
    }
    return res.json({ message: "User detail added successfully", id }); // Respond with a success message and the ID of the new user
  });
});

// Route to update a user by ID
app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id); // Extracting the user ID from the request parameters
  let { name, age, city } = req.body; // Extracting updated user data from the request body
  
  // Check if all fields are provided
  if (!name || !age || !city) {
    res.status(400).send({ message: "All Field Required" }); // Respond with an error message if any field is missing
  }

  // Find the index of the user with the specified ID
  let index = users.findIndex((user) => user.id == id);

  // Update the user data at the found index
  users.splice(index, 1, { ...req.body });

  // Write the updated users array to the JSON file
  fs.writeFile("./Sample.json", JSON.stringify(users), (err, data) => {
    return res.json({
      message: "User Detail Updated Succesfully", // Respond with a success message
    });
  });
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err); // Log an error if the server fails to start
  } else {
    console.log(`App is running on port ${port}`); // Log a message indicating that the server is running
  }
});
