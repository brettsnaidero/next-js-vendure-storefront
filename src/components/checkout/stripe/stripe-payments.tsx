import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/checkout/stripe/checkout-form';

let _stripe: Promise<Stripe | null>;
function getStripe(publishableKey: string) {
  if (!_stripe) {
    _stripe = loadStripe(publishableKey);
  }

  return _stripe;
}

const StripePayments = ({
  clientSecret,
  publishableKey,
  orderCode,
  setProcessing,
  processing,
}: {
  clientSecret: string;
  publishableKey: string;
  orderCode: string;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
}) => {
  const stripePromise = getStripe(publishableKey);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        // passing the client secret obtained from the server
        clientSecret,
      }}
    >
      <CheckoutForm
        orderCode={orderCode}
        setProcessing={setProcessing}
        processing={processing}
      />
    </Elements>
  );
};

export default StripePayments;
