import { Provider } from "@/utils/interface";
import styles from "../app/page.module.css";

const ProviderPill = ({ provider }: { provider: Provider }) => {
  const labels: Record<Provider, string> = {
    openai: "OpenAI",
    gemini: "Gemini",
    claude: "Claude",
  };
  return (
    <div className={`${styles.providerPill} ${styles[`pill_${provider}`]}`}>
      {labels[provider]}
    </div>
  );
};

export default ProviderPill;
