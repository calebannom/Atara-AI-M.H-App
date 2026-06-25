# Atara AI Setup Checklist

## ✅ For Testing:

1. **Copy the example config**
   ```bash
   cp constants/aiConfig.example.ts constants/aiConfig.ts
   ```

2. **Add your API key**
   - Open `constants/aiConfig.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual OpenAI or Gemini API key
   - Choose your provider (`'openai'` or `'gemini'`)
   - Choose your model

3. **Test it out!**
   - Run the app
   - Go to "Chat with Atara"
   - Start messaging!

## 🚀 For Production:

### Step 1: Set Up Firebase Cloud Functions

1. Install Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. Login
   ```bash
   firebase login
   ```

3. Initialize Cloud Functions
   ```bash
   firebase init functions
   ```

### Step 2: Deploy the AI Function

Create `functions/index.js` (or `.ts`) with a function that calls your AI provider securely.

### Step 3: Update the App

- Replace the client-side AI service with a call to your Cloud Function
- This keeps your API key secure!

## 🔒 Security Note:

- **NEVER** commit `constants/aiConfig.ts` to git (it's already in .gitignore)
- **ALWAYS** use Cloud Functions for production to protect your API keys
