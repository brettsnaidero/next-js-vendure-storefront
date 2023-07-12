import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from '@/styles/components/form.module.css';

export const RadioGroup = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  return <div className={styles.group}>{props.children}</div>;
};

const Radio = forwardRef<
  HTMLInputElement,
  {
    children: React.ReactNode;
    checked?: boolean;
    name: string;
    value?: string | number;
    id?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  }
>(function RadioInner(props, ref) {
  return (
    <div
      className={clsx([
        styles.option,
        styles.radio,
        props.checked ? styles.checked : null,
      ])}
    >
      <input
        type="radio"
        id={props.id}
        value={props.value}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        onBlur={props.onBlur}
        ref={ref}
      />
      <div className={styles.dot} />
      {props.children}
    </div>
  );
});

export default Radio;
