@'
# Atara - Mental Health Companion App

## 🌿 About This App

Atara is a beautiful, supportive mental health companion app built with Expo and React Native. It provides a safe, non-judgmental space for users to track their mood, journal their thoughts, set personal goals, and chat with a warm, empathetic AI companion.

## ✨ Key Features

- **Mood Tracking**: Log your mood daily and visualize trends
- **Journaling**: Keep a digital journal of your thoughts and feelings
- **AI Chat**: Chat with "Atara", your warm and supportive mental health companion
- **Goal Setting**: Set and track personal goals
- **Profile Customization**: Customize your display name, bio, and profile picture
- **Professional Referral**: Get connected to mental health professionals if needed
- **Dark/Light Theme**: Choose your preferred theme
- **Reminders**: Set helpful reminders for self-care

## 🛠️ Tech Stack

- **Framework**: Expo 54 + Expo Router
- **Language**: TypeScript
- **Styling**: Custom theme with dark/light mode support
- **AI**: Google Gemini API (with mock fallback for development)
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: AsyncStorage (for local data)

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js (LTS version recommended)
- npm or yarn or pnpm
- Git
- Expo Go app on your phone (for testing on device)

### Clone & Setup

1.  **Clone the repository**

```bash
    git clone https://github.com/calebannom/Atara-AI-M.H-App.git
    cd Atara-AI-M.H-App
```

2.  **Install dependencies**

```bash
    npm install
```

3.  **Environment Setup**
    - Rename `.env.example` (if it exists) or create a `.env` file in the root
    - Add your API keys:

```bash
    EXPO_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key_here
```

4.  **Firebase Setup (Optional but Recommended)**
    - Create a Firebase project
    - Enable Authentication (Email/Password) and Firestore
    - Update your Firebase config in `config/firebase.ts`

5.  **Run the app**

```bash
    npm install
    npx expo start
```

    - Open the Expo Go app on your phone
    - Scan the QR code from your terminal!

## 🗂️ Project Structure


📦 atara

├── 📁 app/                     # Main app directory

│   ├── 📁 (tabs)/             # Tab navigator screens

│   ├── 📁 modal/              # Modal screens

│   └── _layout.tsx            # Root layout

├── 📁 components/             # Reusable components

├── 📁 config/                 # Configuration files

├── 📁 constants/              # Constants and data

├── 📁 context/                # React Context providers

├── 📁 hooks/                  # Custom hooks

├── 📁 utils/                  # Utility functions

├── package.json

└── README.md

## 🤖 AI Configuration

Atara supports Google Gemini as its AI companion. To use the live AI:

1.  Go to [Google AI Studio](https://aistudio.google.com/)
2.  Create an API key
3.  Add it to your `.env` file as shown above
4.  In `services/aiService.ts`, switch from mock responses to the real API!

## 📱 Testing on Physical Device

1.  Install the **Expo Go** app from App Store or Google Play
2.  Make sure your phone is on the **same Wi-Fi network** as your computer
3.  Run `npx expo start`
4.  Scan the QR code with Expo Go!

## 📝 Notes

- For production, make sure to secure your API keys!
- This app is for mental health support and should not replace professional care.
- If you are in crisis, please reach out to a qualified mental health professional.

## 🤝 Contributing

Feel free to contribute by opening issues or pull requests!

## 📄 License

[MIT License](LICENSE)
'@ | Set-Content -Encoding UTF8 README.md
