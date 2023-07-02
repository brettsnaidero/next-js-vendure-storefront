import { XCircleIcon } from '@heroicons/react/24/solid';

export function ErrorMessage({
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
          <XCircleIcon />
        </div>
        <div>
          <h3>{heading}</h3>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
