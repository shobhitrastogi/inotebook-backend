const express = require("express");
const app = express();
const connectToMongo = require("./db/db");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environmental variables
dotenv.config();

// Connect to MongoDB
connectToMongo();

// Define the specific domain of your Netlify app
const allowedOrigins = ['https://main--inquisitive-cajeta-8a1913.netlify.app'];

// Enable CORS for all routes with specific origin
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../inotebook/build')));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Serve the React app on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../inotebook/build/index.html'));
});

// Get port from environmental variables or use 5000 as default
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});

// Handle errors during startup
app.on('error', (err) => {
  console.error('Error during startup:', err);
  process.exit(1); // Exit with a failure code
});
