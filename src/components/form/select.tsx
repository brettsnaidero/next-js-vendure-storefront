import React, { forwardRef } from 'react';
import styles from '@/styles/components/form.module.css';
import clsx from 'clsx';

interface Option {
  value: string | number;
  label: string;
}

const Select = forwardRef<
  HTMLSelectElement,
  {
    options: Option[];
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    id?: string;
    name?: string;
    disabled?: boolean;
    placeholder?: string;
    autoComplete?: string;
    onBlur?: React.ChangeEventHandler<HTMLSelectElement>;
    required?: boolean;
    stretched?: boolean;
    size?: 'small' | 'medium' | 'large';
  }
>(function SelectInner(props, ref) {
  return (
    <select
      className={clsx([
        styles.select,
        props.size === 'small' ? styles.small : null,
        props.size === 'large' ? styles.large : null,
        props.stretched ? styles.stretched : null,
      ])}
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={props.value}
      name={props.name}
      disabled={props.disabled}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
      required={props.required}
      ref={ref}
    >
      {props.options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

export default Select;
