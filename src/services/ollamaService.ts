import { supabase } from "@/integrations/supabase/client";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export const generateWithOllama = async (prompt: string, model: string = 'llama2'): Promise<string> {
  try {
    const { data: { OLLAMA_API_URL }, error: secretError } = await supabase
      .functions.invoke('get-secret', {
        body: { secretName: 'OLLAMA_API_URL' }
      });

    if (secretError || !OLLAMA_API_URL) {
      throw new Error('Failed to get Ollama API URL');
    }

    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as OllamaResponse;
    return data.response;
  } catch (error) {
    console.error('Error generating with Ollama:', error);
    throw error;
  }
}