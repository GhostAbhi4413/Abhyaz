const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017'; // Update with your MongoDB connection details
const dbName = 'feedbackDB'; // Update with your database name

// Middleware to parse JSON body
app.use(express.json());

// Handle form submission
app.post('/submit-feedback', (req, res) => {
  // Extract form data from request body
  const { name, email, satisfaction, easeOfUse, performance, features, reliability, likes, improvements, recommendation, comments } = req.body;

  // Create feedback object
  const feedback = {
    name,
    email,
    satisfaction,
    easeOfUse,
    performance,
    features,
    reliability,
    likes,
    improvements,
    recommendation,
    comments,
    timestamp: new Date()
  };

  // Store feedback in the database
  MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const db = client.db(dbName);
    const feedbackCollection = db.collection('feedback');

    feedbackCollection.insertOne(feedback, (err, result) => {
      if (err) {
        console.error('Error inserting feedback into MongoDB:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      res.status(200).json({ message: 'Feedback submitted successfully' });
      client.close();
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
