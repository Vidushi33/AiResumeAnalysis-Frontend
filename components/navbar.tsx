import { DocumentIcon } from "@/public/icons";
import styles from "../app/page.module.css";

const Navbar = () => {
  return (
    <div className={styles.headerInner}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <DocumentIcon />
        </div>
        <div>
          <div className={styles.logoTitle}>AI Resume Analyzer</div>
          <div className={styles.logoSub}>
            Powered by OpenAI · Gemini · Claude
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
