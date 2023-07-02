import { ArrowPathIcon } from '@heroicons/react/24/outline';

type HighlightedButtonProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> & {
  isSubmitting?: boolean;
};

export function HighlightedButton({
  isSubmitting = false,
  ...props
}: HighlightedButtonProps) {
  return (
    <button disabled={isSubmitting} {...props} className={props.className}>
      {props.children}
      {isSubmitting && (
        <ArrowPathIcon className="w-4 h-4 animate-spin"></ArrowPathIcon>
      )}
    </button>
  );
}
