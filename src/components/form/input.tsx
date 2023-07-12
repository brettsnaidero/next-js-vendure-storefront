import React, { forwardRef } from 'react';
import styles from '@/styles/components/form.module.css';
import clsx from 'clsx';

interface InputProps {
  type?: string;
  id?: string;
  stretched?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}

type Props = InputProps;

const Input = forwardRef<HTMLInputElement, Props>(function InputInner(
  { type = 'text', stretched = false, ...props },
  ref,
) {
  return (
    <input
      className={clsx([styles.input, stretched ? styles.stretched : null])}
      type={type}
      onChange={props.onChange}
      onBlur={props.onBlur}
      name={props.name}
      autoComplete={props.autoComplete}
      ref={ref}
      {...props}
    />
  );
});

export default Input;
