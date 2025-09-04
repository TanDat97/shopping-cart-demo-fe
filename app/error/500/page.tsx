'use client';
import Link from 'next/link';
import styles from '../error.module.scss';

export default function ServerErrorPage() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPage__container}>
        <div className={styles.errorPage__content}>
          <h1 className={styles.errorPage__code}>500</h1>
          <h2 className={styles.errorPage__title}>Server Error</h2>
          <p className={styles.errorPage__description}>
            Something went wrong on our end. We&apos;re working to fix the issue. 
            Please try again later or contact support if the problem persists.
          </p>
          <div className={styles.errorPage__actions}>
            <Link href="/" className={styles.errorPage__button}>
              Go Home
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className={`${styles.errorPage__button} ${styles.errorPage__button__secondary}`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
