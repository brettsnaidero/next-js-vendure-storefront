import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

const AddAddressCard = () => {
  // preventScrollReset
  return (
    <>
      <Link href="/account/addresses/new">
        <span>New address</span>
        <PlusIcon />
      </Link>
    </>
  );
};

export default AddAddressCard;
