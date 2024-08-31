# ProManage

Welcome to **ProManage**! ProManage is a comprehensive collaborative tool designed for employees to streamline task management, assign responsibilities, and facilitate effective communication through integrated video conferencing and chat functionalities. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), ProManage provides a robust platform for team collaboration, helping teams stay organized and connected.

## Setup Instructions

To get ProManage up and running on your local machine, follow these steps:

### Prerequisites

- Ensure you have **Node.js** and **npm** installed. You can download and install them from [Node.js official website](https://nodejs.org/).

- Install **TypeScript** globally using npm:

  ```bash

  npm install -g typescript

  ```

- Ensure **MongoDB** is installed and running locally on port `27017`. You can download it from [MongoDB official website](https://www.mongodb.com/try/download/community).

### Cloning the Repository

1\. **Clone the repository:**

   ```bash

   git clone https://github.com/yourusername/ProManage.git

   cd ProManage

   ```

2\. **Setup Environment Variables:**

   - Create a `.env` file in the root directory of the project.

   - Add your Stream API key and secret to the `.env` file:

     ```

     STREAM_API_KEY=your_stream_api_key

     STREAM_API_SECRET=your_stream_api_secret

     ```

### Backend Setup

1\. **Navigate to the backend directory:**

   ```bash

   cd backend

   ```

2\. **Install backend dependencies:**

   ```bash

   npm install

   ```

3\. **Run the backend server:**

   ```bash

   npm run dev

   ```

### Frontend Setup

1\. **Navigate to the frontend directory:**

   ```bash

   cd ../frontend

   ```

2\. **Install frontend dependencies:**

   ```bash

   npm install

   ```

3\. **Run the frontend development server:**

   ```bash

   npm run dev

   ```

### Running the Application

With both backend and frontend servers running, you should be able to access the ProManage application in your web browser at `http://localhost:5173` , and server running at `http://localhost:7000`

## Troubleshooting

- If you encounter issues with MongoDB, ensure that it's properly installed and running on port `27017`.

- Check your `.env` file for correct Stream API credentials if you face issues with video conferencing or chat functionalities.
  
---
