# NestJS Firebase Cloud Functions

This project is a NestJS application deployed as Firebase Cloud Functions, featuring validation pipes, Swagger documentation, and exception handling.

## 🚀 Features

- NestJS framework with Firebase Cloud Functions
- Input validation using class-validator
- Swagger API documentation
- Custom exception handling
- TypeScript support
- Node.js v22 runtime

## 📋 Prerequisites

- Node.js 18.x or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase account and project
- Firebase project on Blaze (pay-as-you-go) plan

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/lifeShadow59/logicalstreet2.git
cd logicalstreet2
```

2. Install dependencies:

```bash
npm install
```

3. Login to Firebase:

```bash
firebase login
```

4. Initialize Firebase (if not already initialized):

```bash
firebase init functions
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
PORT=3000
# Add other environment variables here
```

### Firebase Configuration

Make sure your `firebase.json` is properly configured:

```json
{
  "functions": [
    {
      "source": "dist",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": ["npm --prefix \"$RESOURCE_DIR/..\" run build"],
      "runtime": "nodejs22"
    }
  ],
  "emulators": {
    "singleProjectMode": true
  }
}
```

## 📦 Project Structure

```
/your-project
├── src/
│   ├── index.ts           # Firebase Functions entry point
│   ├── main.firebase.ts   # NestJS Firebase configuration
│   ├── main.ts           # Original NestJS configuration
│   └── app.module.ts     # App module
├── package.json
├── firebase.json
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy to Firebase:

```bash
npm run deploy
```

Swagger documentation will be available at:

```
https://<region>-<project-id>.cloudfunctions.net/api/api
```

Live url:

```
https://us-central1-lotus-tech-labs.cloudfunctions.net/api/api
```

## 🔍 Local Development

1. Start the local development server:

```bash
npm run start:dev
```

## 📚 Available Scripts

- `npm run build`: Build the project
- `npm run copy-files`: Copy necessary files to dist folder
- `npm run deploy`: Deploy to Firebase
- `npm run start:dev`: Start development server
- `npm run start:debug`: Start in debug mode
- `npm run start:prod`: Start in production mode

## 📝 API Documentation

The API documentation is available through Swagger UI at `/api` when running locally or through the deployed URL.

Features included in the API:

- Input validation
- Custom error handling
- Structured response formats
- Swagger documentation
