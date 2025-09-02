'use client';
import Link from 'next/link';
import styles from '../error.module.scss';

export default function NotFoundPage() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPage__container}>
        <div className={styles.errorPage__content}>
          <h1 className={styles.errorPage__code}>404</h1>
          <h2 className={styles.errorPage__title}>Page Not Found</h2>
          <p className={styles.errorPage__description}>
            The page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className={styles.errorPage__actions}>
            <Link href="/" className={styles.errorPage__button}>
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className={`${styles.errorPage__button} ${styles.errorPage__button__secondary}`}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
