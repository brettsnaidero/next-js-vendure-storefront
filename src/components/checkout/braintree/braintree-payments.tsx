import { useEffect, useState } from 'react';
import dropin, { Dropin } from 'braintree-web-drop-in';
import { CurrencyCode } from '@/graphql-types.generated';
import Button from '@/components/button';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import styles from '@/styles/integrations/braintree.module.css';
import Message from '@/components/message';

const DROP_IN_ELEMENT_ID = 'braintree-drop-in-div';

const BraintreeDropIn = ({
  authorization,
  fullAmount,
  currencyCode,
  addPaymentToOrder,
  setProcessing,
  processing,
}: {
  authorization: string;
  fullAmount: number;
  currencyCode: CurrencyCode;
  addPaymentToOrder: (code: 'braintree', nonce: string) => void;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
}) => {
  const [braintreeInstance, setBraintreeInstance] = useState<Dropin>();
  const [enablePaymentButton, setEnablePaymentButton] = useState<boolean>();
  const [error, setError] = useState<string>();

  const submitPayment = () => {
    setProcessing(true);

    if (braintreeInstance) {
      braintreeInstance.requestPaymentMethod((error, payload) => {
        if (error) {
          console.error(error);
          setError('Error requesting Braintree payment');
        } else {
          addPaymentToOrder('braintree', payload.nonce);
        }
      });
    }
  };

  useEffect(() => {
    const initializeBraintree = () =>
      dropin.create(
        {
          authorization: authorization,
          container: `#${DROP_IN_ELEMENT_ID}`,
          paypal: {
            flow: 'checkout',
            amount: fullAmount / 100, // ?
            currency: currencyCode.toString(),
          },

          // TODO: Configure Apple Pay and Google Pay
          // https://developer.paypal.com/braintree/docs/guides/drop-in/setup-and-integration/javascript/v3/

          // applePay: {
          //   displayName: 'My Store',
          //   paymentRequest: {
          //     total: {
          //       label: 'My Store',
          //       amount: `${fullAmount / 100}`,
          //     },
          //     // We recommend collecting billing address information, at minimum
          //     // billing postal code, and passing that billing postal code with all
          //     // Apple Pay transactions as a best practice.
          //     requiredBillingContactFields: ['postalAddress'],
          //   },
          // },
          // googlePay: {
          //   googlePayVersion: 2,
          //   merchantId: 'merchant-id-from-google',
          //   transactionInfo: {
          //     totalPriceStatus: 'FINAL',
          //     totalPrice: '123.45',
          //     currencyCode: 'USD'
          //   },
          //   allowedPaymentMethods: [{
          //     type: 'CARD',
          //     parameters: {
          //       // We recommend collecting and passing billing address information with all Google Pay transactions as a best practice.
          //       billingAddressRequired: true,
          //       billingAddressParameters: {
          //         format: 'FULL'
          //       }
          //     }
          //   }]
          // }
        },
        function (error, instance) {
          if (error) {
            setError('Error loading Braintree payment options');
          } else if (instance != null) {
            setBraintreeInstance(instance);

            // Check intially if a payment method is requestable
            if (instance.isPaymentMethodRequestable()) {
              setEnablePaymentButton(true);
            } else {
              setEnablePaymentButton(false);
            }

            // Listen for later events indicating a payment method is or is not requestable
            instance.on('paymentMethodRequestable', () => {
              setEnablePaymentButton(true);
            });

            instance.on('noPaymentMethodRequestable', () => {
              setEnablePaymentButton(false);
            });
          }
        },
      );

    if (braintreeInstance) {
      braintreeInstance.teardown().then(() => {
        initializeBraintree();
      });
    } else {
      initializeBraintree();
    }
  }, []);

  if (error) {
    return (
      <Message type="error" text="There was an error loading payment options" />
    );
  }

  return (
    <>
      <div className={styles.braintree}>
        {/* Required! Do not remove. */}
        <div id={DROP_IN_ELEMENT_ID} />
      </div>
      <Button
        onClick={submitPayment}
        className={enablePaymentButton && !processing ? 'processing' : ''}
        disabled={!braintreeInstance || !enablePaymentButton}
        icon={processing ? <ArrowPathIcon width={20} height={20} /> : undefined}
        iconPosition="right"
        size="large"
      >
        {processing
          ? 'Processing...'
          : !braintreeInstance
          ? 'Loading options...'
          : 'Pay'}
      </Button>
    </>
  );
};

export default BraintreeDropIn;
