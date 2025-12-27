# System Architecture: softvibe

## 1. Overview
Softvibe follows a client-heavy architecture, leveraging powerful third-party APIs for compute-intensive tasks (AI reasoning and Code execution).

## 2. Component Diagram

### 2.1 Frontend (React SPA)
- **State Management**: React Hooks (useState, useEffect) with LocalStorage persistence.
- **View Layer**: Functional components styled with Tailwind CSS.
- **Editor**: Monaco Editor instance wrapped in a custom React component.

### 2.2 Service Layer
- **Gemini Service**: Handles communication with `@google/genai`. Formulates system instructions to act as a "tutor" rather than just a code generator.
- **Execution Service**: Manages the Judge0 API interaction. Handles Base64 encoding/decoding of source code and STDIN/STDOUT.

## 3. Data Flow
1. **User Interaction**: Student writes code in Monaco and populates the STDIN buffer.
2. **Execution Flow**: 
   - `App.tsx` calls `executeInSandbox`.
   - Code and STDIN are Base64 encoded.
   - Request sent to Judge0.
   - Result decoded and displayed in the Terminal Output.
3. **Tutoring Flow**:
   - Student clicks "Get AI Help".
   - Current code + Lesson metadata + System Instructions are sent to Gemini 3.
   - Gemini returns Markdown feedback.
   - `ReactMarkdown` renders feedback in the sidebar.

## 4. Security
- **Execution**: All user code is executed in isolated Docker containers via the Judge0 API. No code is executed directly in the user's browser or on our hosting server.
- **API Keys**: Handled via secure environment variables injected at build time.
