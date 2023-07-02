import { XCircleIcon } from '@heroicons/react/24/solid';

export default function Alert({ message }: { message: string }) {
  return (
    <div>
      <div>
        <div>
          <XCircleIcon />
        </div>
        <div>
          <h3>{message}</h3>
        </div>
      </div>
    </div>
  );
}
