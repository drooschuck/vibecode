const JUDGE0_API_URL = 'https://ce.judge0.com';

// Mapping softvibe languages to Judge0 language IDs
const LANGUAGE_IDS: Record<string, number> = {
  'python': 71, // Python (3.8.1)
  'java': 62,   // Java (OpenJDK 13.0.1)
  'c': 50       // C (GCC 9.2.0)
};

export const executeInSandbox = async (code: string, language: string, stdin: string = ''): Promise<string> => {
  const langId = LANGUAGE_IDS[language.toLowerCase()];
  
  if (!langId) {
    throw new Error(`Unsupported language for sandbox execution: ${language}`);
  }

  try {
    // We use wait=true for synchronous-like behavior in the simple UI
    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: btoa(unescape(encodeURIComponent(code))),
        language_id: langId,
        stdin: btoa(unescape(encodeURIComponent(stdin))),
      }),
    });

    const result = await response.json();

    if (result.stdout) return atob(result.stdout);
    if (result.stderr) return `Error: ${atob(result.stderr)}`;
    if (result.compile_output) return `Compilation Error:\n${atob(result.compile_output)}`;
    if (result.message) return `System Message: ${atob(result.message)}`;
    
    return result.status?.description || "Execution finished with no output.";
  } catch (error) {
    console.error("Judge0 Execution Error:", error);
    throw new Error("Failed to connect to the execution sandbox.");
  }
};