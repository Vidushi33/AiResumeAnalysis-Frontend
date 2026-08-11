import { Provider } from "./interface";

export const PROVIDERS: { id: Provider; label: string; model: string }[] = [
  { id: "openai", label: "OpenAI", model: "GPT-4o mini" },
  { id: "gemini", label: "Gemini", model: "Flash 2.0" },
  { id: "claude", label: "Claude", model: "Haiku" },
];
