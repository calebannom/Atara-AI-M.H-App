# Atara AI Integration Guide

## Choose Your AI Provider

You have two great options:

### Option 1: OpenAI (GPT-4o / GPT-4o Mini)
- Best for general intelligence and reasoning
- Good for mental health conversations

### Option 2: Google Gemini (Gemini 2.0 Flash / 2.0 Pro)
- Great for multimodal (images, etc.) if you want that later
- Integrates well with Firebase

---

## Step 1: Get Your API Key

### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Go to API Keys → Create new secret key
4. Save it somewhere safe!

### Google Gemini
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Save it somewhere safe!

---

## Step 2: Set Up Firebase Cloud Functions (RECOMMENDED)

**Important**: We use Cloud Functions so we don't expose our API key in the app!

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Cloud Functions
```bash
cd your-project-directory
firebase init functions
```
- Select "JavaScript" or "TypeScript" (we'll use TypeScript)
- Select "Yes" to install dependencies with npm

---

## Step 3: Atara's System Prompt (Mental Health Companion)

Here's a great system prompt to make Atara a helpful, empathetic mental health companion:

```typescript
const SYSTEM_PROMPT = `You are Atara, a warm, empathetic, and supportive mental health companion. Your purpose is to listen without judgment, validate feelings, and help users reflect on their thoughts and emotions.

Key Guidelines:
1. Be warm, kind, and conversational - use emojis sparingly where appropriate (🌿, 💛, etc.)
2. Listen actively - reflect back what the user shares to show you understand
3. Validate their feelings - let them know it's okay to feel how they do
4. Encourage self-reflection with gentle, open-ended questions
5. Focus on strengths and small steps forward
6. If someone is in crisis or mentions self-harm, encourage them to reach out to a trusted person or a professional helpline immediately
7. Always maintain appropriate boundaries - you're a companion, not a therapist
8. Keep responses relatively concise but thorough enough to be supportive

Your tone should be like a caring, wise friend - not too clinical or robotic.`;
```

---

## Step 4: Write Your Cloud Function

We'll create a function called `chatWithAtara` that takes a conversation history and returns a response!
