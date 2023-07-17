'use client';

import Message from '@/components/message';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
// import { LinkButton } from '@/components/button';
// import { HomeIcon } from '@heroicons/react/24/solid';

const SuccessPage = () => (
  <div className="page">
    <Message
      size="large"
      type="success"
      headingText="Your account has been created successfully!"
      text=" A verification link has been sent to your e-mail address."
      icon={<CheckCircleIcon width={20} height={20} />}
    />
    {/* <LinkButton href="/" icon={<HomeIcon />}>
      Go home
    </LinkButton> */}
  </div>
);

export default SuccessPage;
