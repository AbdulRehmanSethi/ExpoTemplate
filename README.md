# AI Podcast — React Native Expo Template

A production-ready React Native starter built with Expo, TypeScript, Redux Toolkit, and React Navigation. Includes authentication flows, RTK Query API integration, theme management, and EAS build configuration out of the box.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.81.5 + Expo ~54.0.0 |
| Language | TypeScript (strict mode) |
| State Management | Redux Toolkit + Redux Persist |
| API Layer | RTK Query (via Redux Toolkit) |
| Navigation | React Navigation (Stack + Drawer + Bottom Tabs) |
| Storage | AsyncStorage |
| Dev Client | Expo Dev Client |
| Builds | EAS Build |
| Linting | ESLint + Prettier |

---

## Prerequisites

- Node.js 18+
- Yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- For iOS: Xcode 15+, CocoaPods
- For Android: Android Studio, JDK 17

---

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Generate native projects

```bash
npx expo prebuild --clean
```

> The `android/` and `ios/` folders are git-ignored by default. Run prebuild whenever you add a new Expo plugin or upgrade Expo.

### 3. Install iOS pods

```bash
cd ios && pod install && cd ..
```

### 4. Set up environment variables

Create a `.env` file in the root (already git-ignored):

```env
BACKEND_URL=https://your-api-url.com/api/
```

Then expose it in `app.json` under `expo.extra`:

```json
"extra": {
  "BACKEND_URL": "https://your-api-url.com/api/"
}
```

### 5. Start the development server

```bash
yarn start
```

### 6. Run on a device or simulator

```bash
yarn ios       # iOS simulator
yarn android   # Android emulator
```

> These commands require a dev client build installed on the device. See [EAS Builds](#eas-builds) below for how to create one.

---

## Project Structure

```
.
├── assets/                  # App icons, splash, adaptive icon
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BackButton.tsx
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── HeaderButton.tsx
│   │   ├── ScreenContent.tsx
│   │   └── TabBarIcon.tsx
│   ├── navigation/
│   │   ├── index.tsx        # Root stack navigator
│   │   ├── drawer-navigator.tsx
│   │   └── tab-navigator.tsx
│   ├── redux/
│   │   ├── store.ts         # Redux store + persist config
│   │   ├── apiSlice.ts      # RTK Query base API + all endpoints
│   │   ├── auth/
│   │   │   └── authSlice.ts
│   │   ├── chat/
│   │   │   └── chatSlice.tsx
│   │   └── theme/
│   │       └── themeSlice.ts
│   └── screens/
│       ├── home.tsx
│       ├── modal.tsx
│       ├── one.tsx
│       └── two.tsx
├── App.tsx                  # Entry point
├── app.json                 # Expo config
├── eas.json                 # EAS build profiles
├── babel.config.js
├── tsconfig.json
└── package.json
```

Path alias `~/` maps to `src/` (configured in `tsconfig.json`).

---

## Navigation Structure

```
RootStack (Stack Navigator)
├── DrawerNavigator (Drawer Navigator)
│   ├── Home
│   └── Tabs (Bottom Tab Navigator)
│       ├── Tab One
│       └── Tab Two
└── Modal (presented as modal)
```

---

## State Management

Redux store with persisted slices via `redux-persist` + AsyncStorage.

| Slice | Persisted | Purpose |
|---|---|---|
| `auth` | Yes | User session, access token, authentication status |
| `theme` | Yes | Dark mode toggle |
| `chat` | No | Chat/AI conversation state |
| `api` (RTK Query) | No | Server cache, request states |

### Auth Flow

The `authSlice` handles:
- Email/password login
- OTP verification
- Google social login
- Logout (clears token from AsyncStorage)

### API Layer

All API calls are defined in `src/redux/apiSlice.ts` using RTK Query. The base query automatically attaches a Bearer token from AsyncStorage for protected endpoints via `requiresAuth: true`.

Available endpoints:

| Hook | Endpoint | Auth |
|---|---|---|
| `useLoginMutation` | `POST /login/` | No |
| `useSignUpMutation` | `POST /signup/` | No |
| `useSocialLoginMutation` | `POST /accounts/google/callback/` | No |
| `useVerifyOTPMutation` | `POST /verify-otp/` | No |
| `useResendOTPMutation` | `POST /resend-otp/` | No |
| `useCreateProjectMutation` | `POST /create-project/` | Yes |
| `useChatAiMutation` | `POST /assistant-task/` | Yes |
| `useSpeechToTextMutation` | `POST /speech-to-text/` | Yes |
| `useTextToSpeechMutation` | `POST /text-to-speech/` | Yes |
| `useHistoryMutation` | `POST /get-chats/` | Yes |
| `useDeleteHistoryMutation` | `POST /delete-chat/` | Yes |
| `useGetUserSettingsMutation` | `POST /get-user-settings/` | Yes |
| `useSetUserSettingsMutation` | `POST /update-user-settings/` | Yes |
| `useUploadProfileMutation` | `POST /upload-profile-picture/` | Yes |
| `useGetProfileQuery` | `GET /get-profile-picture/` | Yes |

---

## Available Scripts

```bash
yarn start          # Start dev server (requires dev client)
yarn ios            # Run on iOS simulator
yarn android        # Run on Android emulator
yarn prebuild       # Regenerate native folders (expo prebuild)
yarn lint           # Lint + check formatting
yarn format         # Lint fix + format write
yarn build:dev      # EAS development build
yarn build:preview  # EAS preview build (internal distribution)
yarn build:prod     # EAS production build (auto-increment version)
```

---

## EAS Builds

This project uses [Expo Application Services (EAS)](https://expo.dev/eas) for cloud builds.

### Build profiles

| Profile | Distribution | Use case |
|---|---|---|
| `development` | Internal | Dev client build for local development |
| `preview` | Internal | Stakeholder testing, TestFlight/internal track |
| `production` | Store | App Store / Google Play release |

### Create a development client build

```bash
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

Install the resulting build on your device, then use `yarn start` to connect.

### Submit to stores

```bash
eas submit --platform ios
eas submit --platform android
```

---

## Committing Native Code

By default, `android/` and `ios/` are git-ignored. If you need to commit native code (e.g., custom native modules), remove these lines from `.gitignore`:

```
android/
ios/
```

Then run `npx expo prebuild --clean` to regenerate and commit the output.

---

## Code Style

ESLint and Prettier are configured. Run before committing:

```bash
yarn lint
```

To auto-fix:

```bash
yarn format
```
