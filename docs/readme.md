# softvibe

Softvibe is a modern, interactive web-based learning platform designed to teach Python, Java, and C programming through a structured, hands-on approach.

## Key Features
- **Structured Lessons**: 10+ core Python lessons covering everything from basic I/O to complex multi-stage systems.
- **AI Tutoring**: Powered by Gemini 3 Pro, providing context-aware hints and pedagogical feedback.
- **Live Sandbox**: Integrated with the Judge0 execution engine for secure, real-time code execution.
- **Standard Input (STDIN)**: Full support for interactive programs that require user input.
- **Dark Mode Support**: A clean, accessible UI designed for long coding sessions.
- **Offline Resilience**: Progress is saved locally via LocalStorage, allowing for interrupted learning.

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Lucide Icons.
- **Editor**: Monaco Editor (VS Code core).
- **AI**: Google Gemini API (@google/genai).
- **Execution**: Judge0 CE API.
- **Build Tool**: Vite.

## Setup
1. Clone the repository.
2. Ensure you have an environment variable `API_KEY` configured for the Gemini API.
3. Run `npm install` and `npm run dev`.
