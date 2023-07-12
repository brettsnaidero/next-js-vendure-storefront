import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { CreditCardIcon } from '@heroicons/react/24/solid';
import Button from '@/components/button';
import Message from '@/components/message';

const CheckoutForm = ({
  orderCode,
  setProcessing,
  processing,
}: {
  orderCode: string;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    stripe
      .confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: location.origin + `/checkout/confirmation/${orderCode}`,
        },
      })
      .then((result) => {
        if (result.error) {
          setError(true);
        }
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      })
      .catch(() => {
        setError(true);
      });
  };

  if (error) {
    return (
      <Message type="error" text="There was an error loading payment options" />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        disabled={!stripe || processing}
        icon={<CreditCardIcon width={20} height={20} />}
      >
        Pay with Stripe
      </Button>
    </form>
  );
};

export default CheckoutForm;
