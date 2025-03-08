# 🌟 Notify

<div align="center">
  <img src="/public/Images/Notify Logos/logo.png" alt="Notify Banner" />
  <p align="center">
    <strong>Modern collaborative note-taking for seamless teamwork</strong>
  </p>
  <p align="center">
    <a href="https://notify-collaborate-2025.web.app/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/Live_Demo-Visit_App-ec4899?style=for-the-badge&logo=firebase" alt="Live Demo" />
    </a>
  </p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Excalidraw-6366F1?style=for-the-badge&logo=pencil&logoColor=white" alt="Excalidraw" />
</p>

## ✨ Features

### 🎨 Rich Collaborative Experience

- **Real-time drawing board** powered by Excalidraw
- **Collaborative chat** with read receipts
- **Member management** with online presence indicators

### 🔒 Complete Authentication

- Secure email/password authentication
- User profiles with status indicators
- Role-based permissions (note owners vs. collaborators)

### 🖌️ Modern Design

- Stunning gradient UI with pink/fuchsia theme
- Responsive layout for all screen sizes
- Beautiful animations and transitions
- Dark mode optimized interface

### 🚀 Smart Note Management

- Create and manage personal notes
- Share notes with team members
- Delete notes with confirmation
- Unread message notifications

## 📱 Screenshots

<div align="center">
  <img src="/public/Images/readme-files/Workspace.png" alt="Dashboard" />
  <img src="/public/Images/readme-files/Editor.png" alt="Collaborators" />
  <img src="/public/Images/readme-files/Editor.png" alt="Note Editor" />
  <img src="/public/Images/readme-files/Chat.png" alt="Chat" />
  <img src="/public/Images/readme-files/Canvas.png" alt="Canvas" />
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tejanarra/Notify.git
   cd notify
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**

   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Set up Realtime Database
   - Create a web app and get your configuration

4. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_DATABASE_URL=your_database_url
   ```

5. **Run the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

6. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🔧 Project Structure

```
notify/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── AlertModal.js
│   │   ├── Navbar.js
│   │   ├── NoteCard.js
│   │   ├── NoteEditor.js
│   │   ├── CreateNoteForm.js
│   │   ├── notes/
│   │   │   ├── Collaborators.js
│   │   │   └── NoteChat.js
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── firebase.js
│   ├── App.js
│   └── index.js
└── ...
```

## 📊 Firebase Structure

```
/ (root)
├── users/
│   └── [user_id]/
│       ├── email
│       └── displayName
├── notes/
│   └── [note_id]/
│       ├── title
│       ├── createdAt
│       ├── owner
│       ├── ownerEmail
│       ├── members/
│       │   └── [user_id]: true
│       ├── presence/
│       │   └── [user_id]: timestamp
│       ├── content/
│       │   └── drawing/
│       │       ├── elements
│       │       ├── appState
│       │       └── lastUpdated
│       └── chat/
│           └── [message_id]/
│               ├── text
│               ├── imageUrl
│               ├── sender
│               ├── senderEmail
│               ├── timestamp
│               └── readBy/
│                   └── [user_id]: true
```

## 🔍 Key Components

### AlertModal

A versatile modal component with different styles for various actions (default, delete, logout).

### NoteEditor

Real-time collaborative drawing canvas powered by Excalidraw, with automatic saving and synchronization.

### NoteChat

Full-featured collaborative chat with read receipts, date separators, and full-screen mode.

### Collaborators

Member management interface for adding and removing collaborators with online presence indicators.

### NoteCard

Beautiful card component displaying note information, owner details, and notifications for unread messages.

## 🛠️ Advanced Configuration

### Firebase Rules

For secure data access, configure your Firebase database rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth !== null",
        ".write": "$uid === auth.uid"
      }
    },
    "notes": {
      "$noteId": {
        ".read": "data.child('members').hasChild(auth.uid) || data.child('owner').val() === auth.uid",
        ".write": "data.child('owner').val() === auth.uid || (!data.exists() && auth !== null)",
        "members": {
          ".write": "data.parent().child('owner').val() === auth.uid"
        },
        "chat": {
          ".write": "data.parent().child('members').hasChild(auth.uid) || data.parent().child('owner').val() === auth.uid"
        },
        "content": {
          ".write": "data.parent().child('members').hasChild(auth.uid) || data.parent().child('owner').val() === auth.uid"
        },
        "presence": {
          ".write": "data.parent().child('members').hasChild(auth.uid) || data.parent().child('owner').val() === auth.uid"
        }
      }
    }
  }
}
```

## 🌐 Deployment

### Firebase Hosting

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Initialize Firebase:

   ```bash
   firebase init
   ```

   - Select Hosting
   - Select your project
   - Set "build" as your public directory
   - Configure as a single-page app

4. Deploy:
   ```bash
   firebase deploy
   ```

## 📲 Live Demo

Visit our live application at [https://notify-collaborate-2025.web.app](https://notify-collaborate-2025.web.app)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Excalidraw](https://excalidraw.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [FreePik | StorySet](https://storyset.com/business)

---

<p align="center">
  <a href="https://notify-collaborate-2025.web.app" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Try_Notify_Today-ec4899?style=for-the-badge&logo=react" alt="Try Notify Today" />
  </a>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/tejanarra">Sri Sai Teja Narra</a>
</p>
