import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CartContents from '@/components/cart/cart-contents';
import Price from '@/components/products/price';
// import { CartLoaderData } from '@/routes/api/active-order';
import { CurrencyCode } from '@/graphql-types.generated';
import { usePathname } from 'next/navigation';

const CartTray = ({
  open,
  onClose,
  activeOrder,
  adjustOrderLine,
  removeItem,
}: {
  open: boolean;
  onClose: (closed: boolean) => void;
  activeOrder: any; // CartLoaderData['activeOrder'];
  adjustOrderLine?: (lineId: string, quantity: number) => void;
  removeItem?: (lineId: string) => void;
}) => {
  const currencyCode = activeOrder?.currencyCode || CurrencyCode.Usd;
  const pathname = usePathname();
  const editable = !pathname.startsWith('/checkout');

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" onClose={onClose}>
        <div>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay />
          </Transition.Child>

          <div>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div>
                <div>
                  <div>
                    <div>
                      <Dialog.Title>Shopping cart</Dialog.Title>
                      <div>
                        <button type="button" onClick={() => onClose(false)}>
                          <span>Close panel</span>
                          <XMarkIcon />
                        </button>
                      </div>
                    </div>

                    <div>
                      {activeOrder?.totalQuantity ? (
                        <CartContents
                          orderLines={activeOrder?.lines ?? []}
                          currencyCode={currencyCode!}
                          editable={editable}
                          removeItem={removeItem}
                          adjustOrderLine={adjustOrderLine}
                        ></CartContents>
                      ) : (
                        <div>Your cart is empty</div>
                      )}
                    </div>
                  </div>

                  {activeOrder?.totalQuantity && editable && (
                    <div>
                      <div>
                        <p>Subtotal</p>
                        <p>
                          {currencyCode && (
                            <Price
                              priceWithTax={activeOrder?.subTotalWithTax ?? 0}
                              currencyCode={currencyCode}
                            />
                          )}
                        </p>
                      </div>
                      <p>Shipping will be calculated at checkout.</p>
                      <div>
                        <Link href="/checkout" onClick={() => onClose(false)}>
                          Checkout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartTray;
