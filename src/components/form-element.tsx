import React, { PropsWithChildren } from 'react';

type FormElementProps = {
  name: string;
  label?: string;
  required?: boolean;
};

const FormElement: React.FC<PropsWithChildren<FormElementProps>> = ({
  children,
  label,
  name,
  required = false,
}) => {
  const error = undefined;

  return (
    <div>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span>*</span>}
        </label>
      )}
      <div className={label && 'something'}>{children}</div>
      {error && (
        <div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormElement;
