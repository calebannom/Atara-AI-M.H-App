warning: in the working copy of 'app/onboarding.tsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/AI_INTEGRATION_GUIDE.md b/AI_INTEGRATION_GUIDE.md[m
[1mdeleted file mode 100644[m
[1mindex f085139..0000000[m
[1m--- a/AI_INTEGRATION_GUIDE.md[m
[1m+++ /dev/null[m
[36m@@ -1,80 +0,0 @@[m
[31m-# Atara AI Integration Guide[m
[31m-[m
[31m-## Choose Your AI Provider[m
[31m-[m
[31m-You have two great options:[m
[31m-[m
[31m-### Option 1: OpenAI (GPT-4o / GPT-4o Mini)[m
[31m-- Best for general intelligence and reasoning[m
[31m-- Good for mental health conversations[m
[31m-[m
[31m-### Option 2: Google Gemini (Gemini 2.0 Flash / 2.0 Pro)[m
[31m-- Great for multimodal (images, etc.) if you want that later[m
[31m-- Integrates well with Firebase[m
[31m-[m
[31m----[m
[31m-[m
[31m-## Step 1: Get Your API Key[m
[31m-[m
[31m-### OpenAI[m
[31m-1. Go to [OpenAI Platform](https://platform.openai.com)[m
[31m-2. Create an account or sign in[m
[31m-3. Go to API Keys → Create new secret key[m
[31m-4. Save it somewhere safe![m
[31m-[m
[31m-### Google Gemini[m
[31m-1. Go to [Google AI Studio](https://aistudio.google.com)[m
[31m-2. Create an API key[m
[31m-3. Save it somewhere safe![m
[31m-[m
[31m----[m
[31m-[m
[31m-## Step 2: Set Up Firebase Cloud Functions (RECOMMENDED)[m
[31m-[m
[31m-**Important**: We use Cloud Functions so we don't expose our API key in the app![m
[31m-[m
[31m-### 1. Install Firebase CLI[m
[31m-```bash[m
[31m-npm install -g firebase-tools[m
[31m-```[m
[31m-[m
[31m-### 2. Login to Firebase[m
[31m-```bash[m
[31m-firebase login[m
[31m-```[m
[31m-[m
[31m-### 3. Initialize Cloud Functions[m
[31m-```bash[m
[31m-cd your-project-directory[m
[31m-firebase init functions[m
[31m-```[m
[31m-- Select "JavaScript" or "TypeScript" (we'll use TypeScript)[m
[31m-- Select "Yes" to install dependencies with npm[m
[31m-[m
[31m----[m
[31m-[m
[31m-## Step 3: Atara's System Prompt (Mental Health Companion)[m
[31m-[m
[31m-Here's a great system prompt to make Atara a helpful, empathetic mental health companion:[m
[31m-[m
[31m-```typescript[m
[31m-const SYSTEM_PROMPT = `You are Atara, a warm, empathetic, and supportive mental health companion. Your purpose is to listen without judgment, validate feelings, and help users reflect on their thoughts and emotions.[m
[31m-[m
[31m-Key Guidelines:[m
[31m-1. Be warm, kind, and conversational - use emojis sparingly where appropriate (🌿, 💛, etc.)[m
[31m-2. Listen actively - reflect back what the user shares to show you understand[m
[31m-3. Validate their feelings - let them know it's okay to feel how they do[m
[31m-4. Encourage self-reflection with gentle, open-ended questions[m
[31m-5. Focus on strengths and small steps forward[m
[31m-6. If someone is in crisis or mentions self-harm, encourage them to reach out to a trusted person or a professional helpline immediately[m
[31m-7. Always maintain appropriate boundaries - you're a companion, not a therapist[m
[31m-8. Keep responses relatively concise but thorough enough to be supportive[m
[31m-[m
[31m-Your tone should be like a caring, wise friend - not too clinical or robotic.`;[m
[31m-```[m
[31m-[m
[31m----[m
[31m-[m
[31m-## Step 4: Write Your Cloud Function[m
[31m-[m
[31m-We'll create a function called `chatWithAtara` that takes a conversation history and returns a response![m
[1mdiff --git a/AI_SETUP_CHECKLIST.md b/AI_SETUP_CHECKLIST.md[m
[1mdeleted file mode 100644[m
[1mindex 0076311..0000000[m
[1m--- a/AI_SETUP_CHECKLIST.md[m
[1m+++ /dev/null[m
[36m@@ -1,52 +0,0 @@[m
[31m-# Atara AI Setup Checklist[m
[31m-[m
[31m-## ✅ For Testing:[m
[31m-[m
[31m-1. **Copy the example config**[m
[31m-   ```bash[m
[31m-   cp constants/aiConfig.example.ts constants/aiConfig.ts[m
[31m-   ```[m
[31m-[m
[31m-2. **Add your API key**[m
[31m-   - Open `constants/aiConfig.ts`[m
[31m-   - Replace `YOUR_API_KEY_HERE` with your actual OpenAI or Gemini API key[m
[31m-   - Choose your provider (`'openai'` or `'gemini'`)[m
[31m-   - Choose your model[m
[31m-[m
[31m-3. **Test it out!**[m
[31m-   - Run the app[m
[31m-   - Go to "Chat with Atara"[m
[31m-   - Start messaging![m
[31m-[m
[31m-## 🚀 For Production:[m
[31m-[m
[31m-### Step 1: Set Up Firebase Cloud Functions[m
[31m-[m
[31m-1. Install Firebase CLI[m
[31m-   ```bash[m
[31m-   npm install -g firebase-tools[m
[31m-   ```[m
[31m-[m
[31m-2. Login[m
[31m-   ```bash[m
[31m-   firebase login[m
[31m-   ```[m
[31m-[m
[31m-3. Initialize Cloud Functions[m
[31m-   ```bash[m
[31m-   firebase init functions[m
[31m-   ```[m
[31m-[m
[31m-### Step 2: Deploy the AI Function[m
[31m-[m
[31m-Create `functions/index.js` (or `.ts`) with a function that calls your AI provider securely.[m
[31m-[m
[31m-### Step 3: Update the App[m
[31m-[m
[31m-- Replace the client-side AI service with a call to your Cloud Function[m
[31m-- This keeps your API key secure![m
[31m-[m
[31m-## 🔒 Security Note:[m
[31m-[m
[31m-- **NEVER** commit `constants/aiConfig.ts` to git (it's already in .gitignore)[m
[31m-- **ALWAYS** use Cloud Functions for production to protect your API keys[m
[1mdiff --git a/FIREBASE_INDEXES_GUIDE.md b/FIREBASE_INDEXES_GUIDE.md[m
[1mdeleted file mode 100644[m
[1mindex 527e751..0000000[m
[1m--- a/FIREBASE_INDEXES_GUIDE.md[m
[1m+++ /dev/null[m
[36m@@ -1,35 +0,0 @@[m
[31m-# Firebase Firestore Indexes Guide[m
[31m-[m
[31m-## Required Indexes[m
[31m-[m
[31m-### 1. For Moods Collection[m
[31m-- **Collection ID**: `moods`[m
[31m-- **Fields**:[m
[31m-  - `userId` → Ascending[m
[31m-  - `date` → Descending[m
[31m-- **Index Scope**: Collection[m
[31m-[m
[31m-### 2. For Journals Collection[m
[31m-- **Collection ID**: `journals`[m
[31m-- **Fields**:[m
[31m-  - `userId` → Ascending[m
[31m-  - `date` → Descending[m
[31m-- **Index Scope**: Collection[m
[31m-[m
[31m-## How to Create Indexes[m
[31m-[m
[31m-1. Go to [Firebase Console](https://console.firebase.google.com)[m
[31m-2. Select your project[m
[31m-3. Go to **Firestore Database** → **Indexes** tab[m
[31m-4. Click **Add Index**[m
[31m-5. Fill in the details from above[m
[31m-6. Click **Create Index**[m
[31m-7. Wait ~1-2 minutes for the index to build (it will say "Enabled" when ready)[m
[31m-[m
[31m-## Why We Need Indexes[m
[31m-[m
[31m-Firestore requires composite indexes for any query that uses:[m
[31m-- A `where` clause with **equality** filter on one field **AND**[m
[31m-- An `orderBy` clause on **another** field[m
[31m-[m
[31m-This helps Firestore quickly find and sort your data![m
[1mdiff --git a/Gemini.md b/Gemini.md[m
[1mdeleted file mode 100644[m
[1mindex e69de29..0000000[m
[1mdiff --git a/README.md b/README.md[m
[1mindex 732615f..bb6a1fe 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -1,4 +1,3 @@[m
[31m-@'[m
 # Atara - Mental Health Companion App[m
 [m
 ## 🌿 About This App[m
[36m@@ -77,28 +76,27 @@[m [mMake sure you have these installed:[m
 [m
 ## 🗂️ Project Structure[m
 [m
[31m-[m
 📦 atara[m
 [m
[31m-├── 📁 app/                     # Main app directory[m
[32m+[m[32m├── 📁 app/ # Main app directory[m
 [m
[31m-│   ├── 📁 (tabs)/             # Tab navigator screens[m
[32m+[m[32m│ ├── 📁 (tabs)/ # Tab navigator screens[m
 [m
[31m-│   ├── 📁 modal/              # Modal screens[m
[32m+[m[32m│ ├── 📁 modal/ # Modal screens[m
 [m
[31m-│   └── _layout.tsx            # Root layout[m
[32m+[m[32m│ └── \_layout.tsx # Root layout[m
 [m
[31m-├── 📁 components/             # Reusable components[m
[32m+[m[32m├── 📁 components/ # Reusable components[m
 [m
[31m-├── 📁 config/                 # Configuration files[m
[32m+[m[32m├── 📁 config/ # Configuration files[m
 [m
[31m-├── 📁 constants/              # Constants and data[m
[32m+[m[32m├── 📁 constants/ # Constants and data[m
 [m
[31m-├── 📁 context/                # React Context providers[m
[32m+[m[32m├── 📁 context/ # React Context providers[m
 [m
[31m-├── 📁 hooks/                  # Custom hooks[m
[32m+[m[32m├── 📁 hooks/ # Custom hooks[m
 [m
[31m-├── 📁 utils/                  # Utility functions[m
[32m+[m[32m├── 📁 utils/ # Utility functions[m
 [m
 ├── package.json[m
 [m
[36m@@ -133,4 +131,3 @@[m [mFeel free to contribute by opening issues or pull requests![m
 ## 📄 License[m
 [m
 [MIT License](LICENSE)[m
[31m-'@ | Set-Content -Encoding UTF8 README.md[m
[1mdiff --git a/app/onboarding.tsx b/app/onboarding.tsx[m
[1mindex 6c2a975..8d404cb 100644[m
[1m--- a/app/onboarding.tsx[m
[1m+++ b/app/onboarding.tsx[m
[36m@@ -6,38 +6,27 @@[m [mimport { useRouter } from 'expo-router';[m
 import { useSafeAreaInsets } from 'react-native-safe-area-context';[m
 import { LinearGradient } from 'expo-linear-gradient';[m
 import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';[m
[31m-import { useVideoPlayer, VideoView } from 'expo-video';[m
 import { ArrowRight } from 'lucide-react-native';[m
 import storage from '@/utils/storage';[m
 [m
 const { width, height } = Dimensions.get('window');[m
 [m
[31m-// ─── SVG Illustrations ────────────────────────────────────────────────────────[m
[31m-[m
 function MoodIllustration() {[m
   return ([m
     <Svg width={240} height={240} viewBox="0 0 240 240">[m
[31m-      {/* Outer dashed orbit */}[m
       <Circle cx={120} cy={120} r={108}[m
         stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="6 5" fill="none" />[m
[31m-      {/* Middle ring */}[m
       <Circle cx={120} cy={120} r={80}[m
         stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} fill="none" />[m
[31m-      {/* Glow core */}[m
       <Circle cx={120} cy={120} r={58} fill="rgba(255,255,255,0.14)" />[m
       <Circle cx={120} cy={120} r={58}[m
         stroke="rgba(255,255,255,0.38)" strokeWidth={2} fill="none" />[m
[31m-      {/* Mood orbs at 120° apart on middle ring (r=80) */}[m
[31m-      {/* Top (270°): (120, 40) */}[m
       <Circle cx={120} cy={40} r={20} fill="#00C9A7" />[m
       <Circle cx={120} cy={40} r={20} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />[m
[31m-      {/* Bottom-left (150°): (51, 160) */}[m
       <Circle cx={51} cy={160} r={16} fill="#4ADE80" />[m
       <Circle cx={51} cy={160} r={16} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />[m
[31m-      {/* Bottom-right (30°): (189, 160) */}[m
       <Circle cx={189} cy={160} r={16} fill="#60A5FA" />[m
       <Circle cx={189} cy={160} r={16} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />[m
[31m-      {/* Face */}[m
       <Circle cx={107} cy={113} r={5} fill="rgba(255,255,255,0.9)" />[m
       <Circle cx={133} cy={113} r={5} fill="rgba(255,255,255,0.9)" />[m
       <Path d="M 104 130 Q 120 144 136 130"[m
[36m@@ -63,10 +52,8 @@[m [mfunction InsightsIllustration() {[m
 [m
   return ([m
     <Svg width={240} height={220} viewBox="0 0 240 220">[m
[31m-      {/* Decorative rings */}[m
       <Circle cx={120} cy={95} r={85} fill="rgba(255,255,255,0.06)" />[m
       <Circle cx={120} cy={95} r={56} fill="rgba(255,255,255,0.06)" />[m
[31m-      {/* Bars */}[m
       {bars.map((h, i) => {[m
         const x = startX + i * (barW + gap);[m
         const bh = (h / 100) * maxH;[m
[36m@@ -75,13 +62,10 @@[m [mfunction InsightsIllustration() {[m
             fill={i === 5 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)'} />[m
         );[m
       })}[m
[31m-      {/* Baseline */}[m
       <Line x1={startX - 6} y1={baseY} x2={startX + totalW + 6} y2={baseY}[m
         stroke="rgba(255,255,255,0.22)" strokeWidth={1} />[m
[31m-      {/* Trend line */}[m
       <Path d={linePath} stroke="rgba(255,255,255,0.82)" strokeWidth={2.5}[m
         fill="none" strokeLinecap="round" strokeLinejoin="round" />[m
[31m-      {/* Dots */}[m
       {pts.map((p, i) => ([m
         <Circle key={i} cx={p.x} cy={p.y} r={i === 5 ? 7 : 4}[m
           fill="white" opacity={i === 5 ? 1 : 0.65} />[m
[36m@@ -93,40 +77,22 @@[m [mfunction InsightsIllustration() {[m
 function SupportIllustration() {[m
   return ([m
     <Svg width={240} height={210} viewBox="0 0 240 210">[m
[31m-      {/* Main chat bubble */}[m
       <Rect x={16} y={14} width={158} height={110} rx={28} fill="rgba(255,255,255,0.88)" />[m
[31m-      {/* Bubble tail */}[m
       <Path d="M 34 122 L 16 152 L 76 122 Z" fill="rgba(255,255,255,0.88)" />[m
[31m-      {/* Heart */}[m
       <Path[m
         d="M 95 76 C 95 69 86 62 79 67 C 72 72 72 82 82 90 L 95 102 L 108 90 C 118 82 118 72 111 67 C 104 62 95 69 95 76 Z"[m
         fill="#F87171"[m
       />[m
[31m-      {/* Reply bubble */}[m
       <Rect x={110} y={150} width={114} height={50} rx={22} fill="rgba(255,255,255,0.28)" />[m
[31m-      {/* Typing dots */}[m
       <Circle cx={136} cy={175} r={6} fill="rgba(255,255,255,0.9)" />[m
       <Circle cx={160} cy={175} r={6} fill="rgba(255,255,255,0.65)" />[m
       <Circle cx={184} cy={175} r={6} fill="rgba(255,255,255,0.4)" />[m
[31m-      {/* Sparkle top-right */}[m
[31m-      <Path[m
[31m-        d="M 200 40 L 203 49 L 212 49 L 205 54 L 207 63 L 200 58 L 193 63 L 195 54 L 188 49 L 197 49 Z"[m
[31m-        fill="rgba(255,255,255,0.55)"[m
[31m-      />[m
[31m-      {/* Small sparkle bottom-left */}[m
[31m-      <Path[m
[31m-        d="M 20 166 L 22 173 L 29 173 L 24 177 L 26 184 L 20 180 L 14 184 L 16 177 L 11 173 L 18 173 Z"[m
[31m-        fill="rgba(255,255,255,0.35)"[m
[31m-      />[m
     </Svg>[m
   );[m
 }[m
 [m
[31m-// ─── Slide data ───────────────────────────────────────────────────────────────[m
[31m-[m
 type FeatureSlide = {[m
   key: string;[m
[31m-  type: 'feature';[m
   tag: string;[m
   gradient: string[];[m
   title: string;[m
[36m@@ -134,13 +100,28 @@[m [mtype FeatureSlide = {[m
   Illustration: React.FC;[m
 };[m
 [m
[31m-type SlideItem = { key: string; type: 'video' } | FeatureSlide;[m
[32m+[m[32mfunction WelcomeIllustration() {[m
[32m+[m[32m  return ([m
[32m+[m[32m    <Svg width={240} height={240} viewBox="0 0 240 240">[m
[32m+[m[32m      <Circle cx={120} cy={120} r={100} fill="rgba(255,255,255,0.1)" />[m
[32m+[m[32m      <Circle cx={120} cy={120} r={70} fill="rgba(255,255,255,0.15)" />[m
[32m+[m[32m      <Circle cx={120} cy={120} r={40} fill="rgba(255,255,255,0.2)" />[m
[32m+[m[32m      <Circle cx={120} cy={120} r={15} fill="white" />[m
[32m+[m[32m    </Svg>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
 [m
[31m-const SLIDES: SlideItem[] = [[m
[31m-  { key: 'video', type: 'video' },[m
[32m+[m[32mconst SLIDES: FeatureSlide[] = [[m
[32m+[m[32m  {[m
[32m+[m[32m    key: 'welcome',[m
[32m+[m[32m    tag: 'Welcome',[m
[32m+[m[32m    gradient: ['#667eea', '#764ba2', '#f093fb'],[m
[32m+[m[32m    title: 'Meet Atara',[m
[32m+[m[32m    subtitle: 'Your gentle companion for mental wellness and self-discovery.',[m
[32m+[m[32m    Illustration: WelcomeIllustration,[m
[32m+[m[32m  },[m
   {[m
     key: 'mood',[m
[31m-    type: 'feature',[m
     tag: '01 · Feel',[m
     gradient: ['#1A1070', '#4C3BCF', '#7C6FE0'],[m
     title: 'Know how\nyou feel',[m
[36m@@ -149,7 +130,6 @@[m [mconst SLIDES: SlideItem[] = [[m
   },[m
   {[m
     key: 'insights',[m
[31m-    type: 'feature',[m
     tag: '02 · Grow',[m
     gradient: ['#004D3D', '#00A080', '#00C9A7'],[m
     title: 'Patterns\nthat matter',[m
[36m@@ -158,7 +138,6 @@[m [mconst SLIDES: SlideItem[] = [[m
   },[m
   {[m
     key: 'support',[m
[31m-    type: 'feature',[m
     tag: '03 · Connect',[m
     gradient: ['#3A0E80', '#7C3AED', '#A78BFA'],[m
     title: 'Support,\nalways here',[m
[36m@@ -167,19 +146,12 @@[m [mconst SLIDES: SlideItem[] = [[m
   },[m
 ];[m
 [m
[31m-// ─── Main component ───────────────────────────────────────────────────────────[m
[31m-[m
 export default function Onboarding() {[m
   const router = useRouter();[m
   const insets = useSafeAreaInsets();[m
   const flatListRef = useRef<FlatList>(null);[m
   const [currentIndex, setCurrentIndex] = useState(0);[m
 [m
[31m-  const player = useVideoPlayer(require('../assets/Animation/Loading screen.mp4'), (p) => {[m
[31m-    p.loop = true;[m
[31m-    p.play();[m
[31m-  });[m
[31m-[m
   const finish = async () => {[m
     await storage.setItem('atara_onboarded', 'true');[m
     router.replace('/login');[m
[36m@@ -195,8 +167,7 @@[m [mexport default function Onboarding() {[m
     }[m
   };[m
 [m
[31m-  const isVideo = currentIndex === 0;[m
[31m-  const isLast  = currentIndex === SLIDES.length - 1;[m
[32m+[m[32m  const isLast = currentIndex === SLIDES.length - 1;[m
 [m
   return ([m
     <View style={styles.root}>[m
[36m@@ -211,20 +182,7 @@[m [mexport default function Onboarding() {[m
           setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));[m
         }}[m
         renderItem={({ item }) => {[m
[31m-          if (item.type === 'video') {[m
[31m-            return ([m
[31m-              <View style={[styles.slide, { backgroundColor: '#FFFFFF' }]}>[m
[31m-                <VideoView[m
[31m-                  style={styles.videoPlayer}[m
[31m-                  player={player}[m
[31m-                  nativeControls={false}[m
[31m-                  contentFit="contain"[m
[31m-                />[m
[31m-              </View>[m
[31m-            );[m
[31m-          }[m
[31m-[m
[31m-          const { tag, gradient, title, subtitle, Illustration } = item as FeatureSlide;[m
[32m+[m[32m          const { tag, gradient, title, subtitle, Illustration } = item;[m
 [m
           return ([m
             <LinearGradient[m
[36m@@ -233,19 +191,12 @@[m [mexport default function Onboarding() {[m
               start={{ x: 0.15, y: 0 }}[m
               end={{ x: 0.85, y: 1 }}[m
             >[m
[31m-              {/* Decorative background blobs */}[m
               <View style={styles.blobTR} />[m
               <View style={styles.blobBL} />[m
[31m-[m
[31m-              {/* Status-bar spacer */}[m
               <View style={{ height: insets.top + 16 }} />[m
[31m-[m
[31m-              {/* Illustration */}[m
               <View style={styles.illustrationWrap}>[m
                 <Illustration />[m
               </View>[m
[31m-[m
[31m-              {/* Text content */}[m
               <View style={styles.textWrap}>[m
                 <View style={styles.tagPill}>[m
                   <Text style={styles.tagText}>{tag}</Text>[m
[36m@@ -257,16 +208,7 @@[m [mexport default function Onboarding() {[m
           );[m
         }}[m
       />[m
[31m-[m
[31m-      {/* ── Footer ── */}[m
[31m-      <View[m
[31m-        style={[[m
[31m-          styles.footer,[m
[31m-          { paddingBottom: Math.max(insets.bottom + 8, 28) },[m
[31m-          isVideo && styles.footerOnWhite,[m
[31m-        ]}[m
[31m-      >[m
[31m-        {/* Dots */}[m
[32m+[m[32m      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 28) }]}>[m
         <View style={styles.dotsRow}>[m
           {SLIDES.map((_, i) => ([m
             <View[m
[36m@@ -275,45 +217,27 @@[m [mexport default function Onboarding() {[m
                 styles.dot,[m
                 {[m
                   width: i === currentIndex ? 28 : 8,[m
[31m-                  backgroundColor: isVideo[m
[31m-                    ? (i === currentIndex ? '#4C3BCF' : '#C5C0E8')[m
[31m-                    : (i === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)'),[m
[32m+[m[32m                  backgroundColor: i === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)',[m
                 },[m
               ]}[m
             />[m
           ))}[m
         </View>[m
[31m-[m
[31m-        {/* Buttons */}[m
         <View style={styles.btnRow}>[m
[31m-          {/* Left: Skip or spacer */}[m
           {!isLast ? ([m
             <TouchableOpacity onPress={finish} hitSlop={10} style={styles.skipBtn}>[m
[31m-              <Text style={[styles.skipText, { color: isVideo ? '#6B6B8A' : 'rgba(255,255,255,0.75)' }]}>[m
[31m-                Skip[m
[31m-              </Text>[m
[32m+[m[32m              <Text style={styles.skipText}>Skip</Text>[m
             </TouchableOpacity>[m
           ) : ([m
             <View style={styles.skipBtn} />[m
           )}[m
[31m-[m
[31m-          {/* Right: Next / Continue / Get Started */}[m
           <TouchableOpacity[m
             onPress={handleNext}[m
             activeOpacity={0.85}[m
[31m-            style={[[m
[31m-              styles.nextBtn,[m
[31m-              isVideo && styles.nextBtnSolid,[m
[31m-              isLast && styles.nextBtnWhite,[m
[31m-            ]}[m
[32m+[m[32m            style={[styles.nextBtn, isLast && styles.nextBtnWhite]}[m
           >[m
[31m-            <Text[m
[31m-              style={[[m
[31m-                styles.nextText,[m
[31m-                isLast && styles.nextTextDark,[m
[31m-              ]}[m
[31m-            >[m
[31m-              {isLast ? 'Get Started' : isVideo ? 'Begin' : 'Next'}[m
[32m+[m[32m            <Text style={[styles.nextText, isLast && styles.nextTextDark]}>[m
[32m+[m[32m              {isLast ? 'Get Started' : 'Next'}[m
             </Text>[m
             {!isLast && <ArrowRight size={17} color="#FFF" strokeWidth={2.5} />}[m
           </TouchableOpacity>[m
[36m@@ -323,20 +247,9 @@[m [mexport default function Onboarding() {[m
   );[m
 }[m
 [m
[31m-// ─── Styles ───────────────────────────────────────────────────────────────────[m
[31m-[m
 const styles = StyleSheet.create({[m
   root: { flex: 1 },[m
[31m-[m
   slide: { width, height },[m
[31m-[m
[31m-  videoPlayer: {[m
[31m-    width: '100%',[m
[31m-    height: '100%',[m
[31m-    backgroundColor: '#FFFFFF',[m
[31m-  },[m
[31m-[m
[31m-  // Decorative blobs[m
   blobTR: {[m
     position: 'absolute',[m
     top: -90,[m
[36m@@ -355,15 +268,11 @@[m [mconst styles = StyleSheet.create({[m
     borderRadius: 110,[m
     backgroundColor: 'rgba(255,255,255,0.05)',[m
   },[m
[31m-[m
[31m-  // Illustration[m
   illustrationWrap: {[m
     flex: 1,[m
     justifyContent: 'center',[m
     alignItems: 'center',[m
   },[m
[31m-[m
[31m-  // Text[m
   textWrap: {[m
     paddingHorizontal: 32,[m
     paddingBottom: 140,[m
[36m@@ -382,13 +291,13 @@[m [mconst styles = StyleSheet.create({[m
   tagText: {[m
     color: 'rgba(255,255,255,0.9)',[m
     fontSize: 12,[m
[31m-    fontFamily: 'Poppins-Bold',[m
[32m+[m[32m    fontWeight: 'bold',[m
     letterSpacing: 0.5,[m
   },[m
   title: {[m
     color: '#FFFFFF',[m
     fontSize: 38,[m
[31m-    fontFamily: 'Poppins-Bold',[m
[32m+[m[32m    fontWeight: 'bold',[m
     lineHeight: 46,[m
     marginBottom: 14,[m
     letterSpacing: -0.5,[m
[36m@@ -396,11 +305,8 @@[m [mconst styles = StyleSheet.create({[m
   subtitle: {[m
     color: 'rgba(255,255,255,0.78)',[m
     fontSize: 15,[m
[31m-    fontFamily: 'Poppins-Regular',[m
     lineHeight: 24,[m
   },[m
[31m-[m
[31m-  // Footer[m
   footer: {[m
     position: 'absolute',[m
     bottom: 0,[m
[36m@@ -409,9 +315,6 @@[m [mconst styles = StyleSheet.create({[m
     paddingHorizontal: 28,[m
     paddingTop: 16,[m
   },[m
[31m-  footerOnWhite: {},[m
[31m-[m
[31m-  // Dots[m
   dotsRow: {[m
     flexDirection: 'row',[m
     justifyContent: 'center',[m
[36m@@ -423,8 +326,6 @@[m [mconst styles = StyleSheet.create({[m
     height: 8,[m
     borderRadius: 4,[m
   },[m
[31m-[m
[31m-  // Buttons[m
   btnRow: {[m
     flexDirection: 'row',[m
     justifyContent: 'space-between',[m
[36m@@ -437,7 +338,8 @@[m [mconst styles = StyleSheet.create({[m
   },[m
   skipText: {[m
     fontSize: 15,[m
[31m-    fontFamily: 'Poppins-SemiBold',[m
[32m+[m[32m    fontWeight: '600',[m
[32m+[m[32m    color: 'rgba(255,255,255,0.75)',[m
   },[m
   nextBtn: {[m
     flexDirection: 'row',[m
[36m@@ -452,10 +354,6 @@[m [mconst styles = StyleSheet.create({[m
     minWidth: 130,[m
     justifyContent: 'center',[m
   },[m
[31m-  nextBtnSolid: {[m
[31m-    backgroundColor: '#4C3BCF',[m
[31m-    borderColor: 'transparent',[m
[31m-  },[m
   nextBtnWhite: {[m
     backgroundColor: '#FFFFFF',[m
     borderColor: 'transparent',[m
[36m@@ -464,7 +362,7 @@[m [mconst styles = StyleSheet.create({[m
   nextText: {[m
     color: '#FFFFFF',[m
     fontSize: 15,[m
[31m-    fontFamily: 'Poppins-Bold',[m
[32m+[m[32m    fontWeight: 'bold',[m
   },[m
   nextTextDark: {[m
     color: '#4C3BCF',[m
[1mdiff --git a/assets/Animation/Loading screen.mp4 b/assets/Animation/Loading screen.mp4[m
[1mdeleted file mode 100644[m
[1mindex 2ea2b2c..0000000[m
Binary files a/assets/Animation/Loading screen.mp4 and /dev/null differ
