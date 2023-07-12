import React, { forwardRef } from 'react';
import styles from '@/styles/components/form.module.css';
import clsx from 'clsx';

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    children: React.ReactNode;
    name: string;
    id?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.ChangeEventHandler<HTMLInputElement>;
    checked?: boolean;
    value?: string | number;
  }
>(function CheckboxInner({ children, ...props }, ref) {
  console.log(props.checked);
  return (
    <div
      className={clsx([
        styles.option,
        styles.checkbox,
        props.checked ? styles.checked : null,
      ])}
    >
      <input
        type="checkbox"
        {...props}
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        ref={ref}
      />
      <div
        className={clsx([styles.check, props.checked ? styles.checked : null])}
      />

      {children}
    </div>
  );
});

export default Checkbox;
