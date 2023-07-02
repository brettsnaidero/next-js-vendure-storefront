import clsx from 'clsx';
import React from 'react';
import FormElement from './form-element';

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> & {
  label?: string;
  name: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, required, ...props }, ref) => {
    const { error, getInputProps } = useField(name);

    return (
      <FormElement name={name} label={label} required={required}>
        <input
          ref={ref}
          {...props}
          {...getInputProps()}
          className={props.className}
        >
          {props.children}
        </input>
      </FormElement>
    );
  },
);
