import React from 'react';
import styles from '@/styles/components/loading.module.css';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const Loading = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className={styles.page}>
      <div>
        <div className={styles.spinner}>
          <ArrowPathIcon width={20} height={20} />
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
};

const LoadingPage = ({ text }: { text?: string }) => {
  return <Loading text={text} />;
};

export default LoadingPage;
