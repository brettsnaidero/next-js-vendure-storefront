import { CreditCardIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { EligiblePaymentMethodsQuery } from '@/graphql-types.generated';

const DummyPayments = ({
  paymentMethod,
  paymentError,
}: {
  paymentMethod: EligiblePaymentMethodsQuery['eligiblePaymentMethods'][number];
  paymentError?: string;
}) => {
  const onSubmit = () => {
    // paymentMethod.code
  };

  return (
    <div>
      <p>This is a dummy payment for demonstration purposes only</p>
      {paymentError && (
        <div>
          <div>
            <div>
              <XCircleIcon aria-hidden="true" />
            </div>
            <div>
              <h3>There was an error processing the payment</h3>
              <div>{paymentError}</div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <button type="submit">
          <CreditCardIcon></CreditCardIcon>
          <span>Pay with {paymentMethod.name}</span>
        </button>
      </form>
    </div>
  );
};

export default DummyPayments;
