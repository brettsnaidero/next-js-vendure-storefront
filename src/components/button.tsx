import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/components/button.module.css';
import Link, { LinkProps } from 'next/link';

interface ButtonInternalsProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const ButtonInternals = ({
  iconPosition,
  icon,
  children,
}: ButtonInternalsProps) => (
  <>
    {iconPosition === 'left' && icon && (
      <div
        className={clsx([
          styles.icon,
          children ? styles.beside : null,
          styles.left,
        ])}
      >
        {icon}
      </div>
    )}
    {children}
    {iconPosition === 'right' && icon && (
      <div
        className={clsx([
          styles.icon,
          children ? styles.beside : null,
          styles.right,
        ])}
      >
        {icon}
      </div>
    )}
  </>
);

type ButtonProps = {
  className?: string;
  'aria-label'?: string;
  stretch?: boolean;
  size?: 'small' | 'medium' | 'large';
  role?: 'primary' | 'secondary' | 'negative'; // | 'tertiary';
} & ButtonInternalsProps;

const Button = ({
  children,
  type = 'button',
  iconPosition = 'left',
  icon,
  size = 'medium',
  role = 'primary',
  ...props
}: {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLButtonElement>) => void;
} & ButtonProps) => (
  <button
    type={type}
    className={clsx([
      styles.button,
      props.stretch ? styles.stretch : null,
      size === 'small' ? styles.small : null,
      size === 'large' ? styles.large : null,
      role === 'secondary' ? styles.secondary : null,
      role === 'negative' ? styles.negative : null,
      props.className,
    ])}
    disabled={props.disabled}
    onClick={props.onClick}
    onBlur={props.onBlur}
    aria-label={props['aria-label']}
  >
    <ButtonInternals iconPosition={iconPosition} icon={icon}>
      {children}
    </ButtonInternals>
  </button>
);

export const LinkButton = ({
  iconPosition = 'left',
  icon,
  children,
  href,
  stretch,
  className,
  size = 'medium',
  role = 'primary',
  ...props
}: { href: string; role?: string } & LinkProps & ButtonProps) => (
  <Link
    href={href}
    className={clsx([
      styles.button,
      stretch ? styles.stretch : null,
      size === 'small' ? styles.small : null,
      size === 'large' ? styles.large : null,
      role === 'secondary' ? styles.secondary : null,
      role === 'negative' ? styles.negative : null,
      className,
    ])}
    {...props}
  >
    <ButtonInternals iconPosition={iconPosition} icon={icon}>
      {children}
    </ButtonInternals>
  </Link>
);

export const ButtonTray = ({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) => (
  <div className={clsx([styles.tray, align === 'right' ? styles.right : null])}>
    {children}
  </div>
);

export default Button;
