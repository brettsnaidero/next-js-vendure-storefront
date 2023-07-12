import styles from '@/styles/components/form.module.css';
import Message from '@/components/message';

const Field = ({
  children,
  label,
  htmlFor,
  errorMessage,
  required,
}: {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  errorMessage?: string;
  required?: boolean;
}) => (
  <div className={styles.field}>
    {label ? (
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required ? <span className={styles.required}> *</span> : null}
      </label>
    ) : null}
    {children}
    {errorMessage ? (
      <div className={styles.warning}>
        <Message type="warning" text={errorMessage} />
      </div>
    ) : null}
  </div>
);

export default Field;
