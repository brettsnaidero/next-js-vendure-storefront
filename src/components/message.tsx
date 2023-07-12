import React, { useState } from 'react';
import styles from '@/styles/components/message.module.css';
import { XCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface MessageProps {
  text?: string;
  showIcon?: boolean;
  headingText?: string;
  closable?: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'large';
  icon?: React.ReactNode;
}

const Message = ({ type = 'info', size = 'small', ...props }: MessageProps) => {
  const [showMessage, setShowMessage] = useState(true);

  if (!showMessage) {
    return null;
  }

  return (
    <div
      className={clsx([
        styles.message,
        type === 'success' && styles.success,
        type === 'error' && styles.error,
        type === 'warning' && styles.warning,
        type === 'info' && styles.info,
        size === 'large' && styles.large,
      ])}
    >
      {props.icon && <div className={styles.icon}>{props.icon}</div>}

      <div className={styles.text}>
        {props.headingText && (
          <div className={styles.heading}>{props.headingText}</div>
        )}
        {props.text}
      </div>
      {props.closable && (
        <div className={styles.close}>
          <button
            type="button"
            onClick={() => setShowMessage(false)}
            className={styles.button}
          >
            <XCircleIcon width={20} height={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
