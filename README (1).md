# 🎤 Transly: AI-Powered Meeting Summarizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📝 Description

Transly is a full-stack web application that leverages AI to automatically transcribe and summarize audio and video recordings of meetings. It extracts key information such as action items, deadlines, and assigned personnel, providing structured insights to enhance team productivity.  The application is built using React, Express, Node.js, and MongoDB.

## 📑 Table of Contents

- [📝 Description](#-description)
- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [🚀 Installation](#-installation)
- [🎯 Usage](#-usage)
- [📂 Project Structure](#-project-structure)
- [🔑 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🔗 Important Links](#-important-links)
- [📃 Footer](#-footer)

## ✨ Features

- 🎤 **Audio/Video Upload**: Supports uploading meeting recordings in various formats (MP3, WAV, M4A, OGG, MP4, MOV, MKV, WEBM).
- 🧾 **Speech-to-Text**: Transcribes audio and video files using the Whisper model.
- ✍️ **Summarization**: Generates concise summaries of meeting transcripts using the BART model.
- ✅ **Task Extraction**: Identifies and extracts action items, deadlines, and assignees from meeting transcripts.
- 📊 **Priority Scoring**: Assigns priority levels (high, medium, low) to extracted tasks.
- 📄 **PDF Export**: Allows exporting meeting summaries, tasks, and full transcripts to PDF.
- 🔐 **User Authentication**: Secure user registration and login with JWT authentication.
- ☁️ **Cloud or Local**: All processing can be run on cloud or locally.
- 📢 **Share Publicly**: Share meeting reports via a token based URL. 

## 🧰 Tech Stack

| Category         | Technology                                  |
|------------------|---------------------------------------------|
| Frontend         | React, Vite, Tailwind CSS, JavaScript       |
| Backend          | Node.js, Express.js, JavaScript             |
| Database         | MongoDB                                     |
| Authentication   | JWT                                         |
| AI Models        | Whisper (Speech-to-Text), BART (Summarization) |
| Python           | Python                                       |

## 🚀 Installation

1.  **Clone the repository:**

   ```bash
   git clone https://github.com/Awanish9230/Transly.git
   cd Transly
   ```

2.  **Backend Setup:**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env file with your MongoDB URI, JWT secret, etc.
   # MONGODB_URI=mongodb://localhost:27017/meeting-ai
   # JWT_SECRET=your_secret_key_here
   ```

3.  **AI Models Setup:**

   ```bash
   cd ../ai-models
   python -m venv venv
   source venv/bin/activate 
   pip install -r requirements.txt
   ```

4.  **Frontend Setup:**

   ```bash
   cd ../frontend
   npm install
   ```

## 🎯 Usage

1.  **Start MongoDB:**

    Ensure MongoDB is running.  If you have it installed as a service:

    ```bash
    # For Linux
    sudo systemctl start mongodb

    # For Windows, run as administrator:
    net start MongoDB
    ```

    Alternatively, start it manually:

    ```bash
    # Navigate to your MongoDB installation directory
    cd "C:\Program Files\MongoDB\Server\7.0\bin"
    mongod --dbpath "C:\data\db"
    ```

2.  **Run the Backend Server:**

    ```bash
    cd backend
    npm run dev
    ```

    The server will start on `http://localhost:5000`.

3.  **Run the Frontend Development Server:**

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend will start on `http://localhost:5173`.

4.  **Access the Application:**

    Open your browser and navigate to `http://localhost:5173`.

5.  **Sign Up/Log In:**

    Create a new account or log in with an existing account.

6.  **Upload and Process Audio/Video Files:**

    *   Click on "Upload Audio/Video".
    *   Enter a meeting title (optional).
    *   Select an audio or video file.
    *   Click "Upload & Process".

7.  **View Meeting Reports:**

    Once processing is complete, you can view the full transcript, summary, and extracted tasks.

## 🔑 API Reference

### Authentication

-   `POST /api/auth/signup`: Registers a new user.
-   `POST /api/auth/login`: Logs in an existing user and returns a JWT token.

### Meetings

-   `POST   /api/meetings/upload` : Upload a meeting file (audio or video).
-   `POST   /api/meetings/:id/process` : Process uploaded meeting, transcribing, summarizing and extracting the tasks.
-   `GET    /api/meetings` : Get all meetings for the logged-in user.
-   `GET    /api/meetings/:id` : Get a specific meeting by ID.
-   `POST   /api/meetings/:id/share` : Share a meeting, generating a public token.
-   `DELETE /api/meetings/:id/share`: Disable sharing, removing the public link.
-   `DELETE /api/meetings/:id` : Delete a meeting.
-   `GET    /api/meetings/:id/status` : Get processing status of a meeting.

### Public

-   `GET /api/public/meetings/:token`: Retrieves a public meeting report using a share token.

## 📂 Project Structure

```
Transly/
├── ai-models/
│   ├── extract_tasks.py   # Extracts tasks from transcript
│   ├── requirements.txt    # Python dependencies
│   ├── summarize.py        # Summarizes transcript
│   └── transcribe.py       # Transcribes audio
├── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   └── meetingController.js # Handles meeting requests
│   ├── middleware/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/
│   │   ├── Meeting.js      # Meeting model
│   │   └── User.js         # User model
│   ├── routes/
│   │   ├── authRoutes.js   # Authentication routes
│   │   ├── meetingRoutes.js # Meeting routes
│   │   └── publicRoutes.js  # Public routes
│   ├── services/
│   │   └── aiService.js    # Orchestrates AI processing
│   ├── .env                # Environment variables
│   └── server.js           # Express server
└── frontend/
    ├── public/
    │   └── logo1.jpg          # Project logo
    ├── src/
    │   ├── components/
    │   │   ├── AnnouncementBar.jsx # Announcement banner
    │   │   ├── AudioUploader.jsx # Component to upload audio
    │   │   ├── Footer.jsx        # Footer component
    │   │   ├── Header.jsx        # Header component
    │   │   ├── HeroSection.jsx   # Hero section for landing
    │   │   ├── MeetingCard.jsx   # Displays meeting data
    │   │   ├── MeetingList.jsx   # Lists meetings
    │   │   └── PromoBanner.jsx   # Promotion banner
    │   ├── pages/
    │   │   ├── Dashboard.jsx   # Main dashboard
    │   │   ├── Login.jsx       # Login page
    │   │   ├── PublicReport.jsx # Public meeting report
    │   │   ├── Report.jsx      # Single meeting report
    │   │   └── Signup.jsx      # Signup page
    │   ├── utils/
    │   │   └── api.js          # Axios config
    │   ├── App.jsx           # Main app component
    │   ├── index.css       # Global CSS
    │   └── main.jsx          # Entry point
    ├── tailwind.config.js  # Tailwind CSS config
    └── vite.config.js      # Vite config
```

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Important Links

*   **Repository:** [https://github.com/Awanish9230/Transly](https://github.com/Awanish9230/Transly)

## 📃 Footer

© 2025 Transly - [https://github.com/Awanish9230/Transly](https://github.com/Awanish9230/Transly) by Awanish9230.

⭐️ Fork, like, and raise issues to contribute!
