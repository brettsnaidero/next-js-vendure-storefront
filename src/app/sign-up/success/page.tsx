import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const SuccessPage = () => (
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              <CheckCircleIcon aria-hidden="true" />
            </div>
          </div>
          <p>
            Your account has been created successfully! A verification link has
            been sent to your e-mail address.
          </p>
          <Link href="/">Go home</Link>
        </div>
      </div>
    </div>
  </div>
);

export default SuccessPage;
