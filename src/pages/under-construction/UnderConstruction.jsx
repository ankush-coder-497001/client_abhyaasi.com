import styles from "./UnderConstruction.module.css";

const UnderConstruction = () => {
  return (
    <div className={styles["app-root"]}>
      <header className={styles["top-bar"]}>
        <div className={styles.brand}>Abhyasi</div>
      </header>

      <main className={styles.content}>
        <div className={styles.card}>
          <div className={styles.icon} aria-hidden>
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M2 20h20"
                stroke="#FFB020"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 20V9a7 7 0 0 1 14 0v11"
                stroke="#FFB020"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11h6"
                stroke="#222"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="5" r="2" fill="#FFB020" />
            </svg>
          </div>

          <h1>We’re building something great</h1>
          <p className={styles.lead}>
            This site is under construction. We’re working hard to bring you an
            improved experience. Check back soon.
          </p>

          <div className={styles.progress} aria-hidden>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnderConstruction;
