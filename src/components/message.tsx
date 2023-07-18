import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/components/message.module.css';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface MessageProps {
  text?: string;
  showIcon?: boolean;
  headingText?: string;
  closableCallback?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'large';
  icon?: React.ReactNode;
}

const Message = ({ type = 'info', size = 'small', ...props }: MessageProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
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
    {props.closableCallback && (
      <div className={styles.close}>
        <button
          type="button"
          onClick={props.closableCallback}
          className={styles.button}
        >
          <XMarkIcon width={20} height={20} />
        </button>
      </div>
    )}
  </motion.div>
);

export default Message;
