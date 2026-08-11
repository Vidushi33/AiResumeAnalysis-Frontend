import { Provider } from "./interface";
import { ClaudeIcon, GeminiIcon, OpenaiIcon } from "@/public/icons";

export function ProviderIcon({ id }: { id: Provider }) {
  if (id === "openai") return <OpenaiIcon />;
  if (id === "gemini") return <GeminiIcon />;
  return <ClaudeIcon />;
}