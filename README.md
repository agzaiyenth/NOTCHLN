# GovDocs - Your AI Document Assistant

[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()

**GovDocs** helps you request, track, and verify your government documents effortlessly with AI guidance.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Variables](#environment-variables)
  - [Install Dependencies](#install-dependencies)
  - [Run the App](#run-the-app)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

---

## Features

- **AI-assisted guidance** for government document processes
- **Request tracking** to monitor your document status
- **Document verification** capabilities
- **Seamless local development** setup
- **Modern web interface** built with Next.js
- **Service completion time prediction** using machine learning
- Optional integration with Supabase for data persistence

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn package manager (**do not use npm**)

### Clone the Repository

```bash
git clone https://github.com/agzaiyenth/NOTCHLN.git
cd NOTCHLN
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following environment variables:

```env
# Required for AI chat functionality
GROQ_API_KEY=your_groq_api_key_here

# Optional: For development redirects (if using Supabase later)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

NEXT_PUBLIC_PREDICTION_API_URL=http://localhost:5000
```

> **Note:** To get a GROQ_API_KEY, create an account and generate a new key at [Groq Console](https://console.groq.com/)

### Install Dependencies

```bash
yarn
```

### Run the App

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Run the Prediction API

The application includes a machine learning model that predicts service completion times. To run the prediction API:

```bash
cd api
# On Windows
run_api.bat

# On Linux/Mac
chmod +x run_api.sh
./run_api.sh
```

The prediction API will be available at [http://localhost:5000](http://localhost:5000).

---

## Usage

1. **Start the application** using the commands above
2. **Navigate to the web interface** at localhost:3000
3. **Interact with the AI assistant** for guidance on government document processes
4. **Track your requests** and monitor document status
5. **Verify documents** using the built-in verification tools

---

## Project Structure

```
NOTCHLN/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── [page-folders]/    # Individual page components
│   └── ...                # Other app router files
├── components/            # Reusable React components
│   ├── application-tracker/
│   ├── chat-preview/
│   ├── document-upload/
│   ├── theme-provider/
│   └── ...
├── public/               # Static assets (images, icons, etc.)
├── .env.local           # Environment variables (create this)
├── .gitattributes       # Git attributes configuration
├── .gitignore           # Git ignore rules
├── components.json      # shadcn/ui components configuration
├── next-env.d.ts        # Next.js TypeScript declarations
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies and scripts
├── package-lock.json    # npm lock file
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Troubleshooting

### App doesn't start / missing modules

- Ensure you are using **Yarn** (not npm) and run `yarn` to install dependencies
- Delete `node_modules` and `yarn.lock`, then run `yarn` again if issues persist

### Environment variables not loaded

- Check that `.env.local` exists in the project root
- Verify that all required environment variables are present and correctly formatted
- Restart the development server after making changes to `.env.local`

### Port conflicts

- The default port is 3000
- If port 3000 is in use, Next.js will automatically try the next available port
- Update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` in `.env.local` if using a different port

### API Key Issues

- Ensure your GROQ_API_KEY is valid and has sufficient credits
- Check the [Groq Console](https://console.groq.com/) for API usage and limits

---

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Search existing issues in the GitHub repository
3. Create a new issue with detailed information about your problem
4. Include your operating system, Node.js version, and error messages

---

## Development

This project is built with:

- **Next.js 13+** with App Router - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI and Tailwind CSS
- **Yarn** - Package manager (note: package-lock.json suggests npm was also used)
- **Groq API** - AI capabilities for document assistance
- **Supabase** (optional) - Backend services

The project uses the modern Next.js App Router structure with individual page folders and API routes organized under the `app/` directory.
