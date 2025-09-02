'use client';
import Link from 'next/link';
import styles from '../error.module.scss';

export default function ForbiddenPage() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPage__container}>
        <div className={styles.errorPage__content}>
          <h1 className={styles.errorPage__code}>403</h1>
          <h2 className={styles.errorPage__title}>Access Forbidden</h2>
          <p className={styles.errorPage__description}>
            You don't have permission to access this resource. 
            Please contact your administrator if you believe this is an error.
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
