# Firebase Function Postmark

First, run the development server:

```bash
cd functions
#then
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Setup Firebase:

```bash
npm install -g firebase-tools
#then
firebase init emulators
#then select
(Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◯ Authentication Emulator
 ◉ Functions Emulator
 ◯ Firestore Emulator
 ◯ Database Emulator
 ◯ Hosting Emulator
 ◯ Pub/Sub Emulator
 ◯ Storage Emulator
#then
firebase emulators:start
#then visit
http://localhost:5001/project-id/us-central1/api/v1/health

```

Create New Prject

```bash
firebase init functions
```
