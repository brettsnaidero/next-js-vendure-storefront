import React, { SelectHTMLAttributes } from 'react';
import FormElement from './form-element';

export type SelectProps = {
  placeholder?: string;
  noPlaceholder?: boolean;
  label?: string;
  name: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      name,
      label,
      required,
      defaultValue,
      placeholder = 'Select...',
      noPlaceholder = false,
      children,
      ...props
    },
    ref,
  ) => (
    <FormElement name={name} label={label} required={required}>
      <select
        ref={ref}
        {...props}
        defaultValue={defaultValue}
        // {...getInputProps({})}
      >
        {!noPlaceholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    </FormElement>
  ),
);
