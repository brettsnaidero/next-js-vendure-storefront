import { CheckIcon } from '@heroicons/react/24/solid';

export function SuccessMessage({
  heading,
  message,
}: {
  heading: string;
  message: string;
}) {
  return (
    <div>
      <div>
        <div>
          <CheckIcon />
        </div>
        <div>
          <h3>{heading}</h3>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
