import { Fragment } from 'react';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'next/navigation';
import { FacetFilterTracker } from '@/components/facet-filter/facet-filter-tracker';

const FacetFilterControls = ({
  facetFilterTracker,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  facetFilterTracker: FacetFilterTracker;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
}) => {
  const searchParams = useSearchParams();
  const q = searchParams.getAll('q');

  return (
    <>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div />
          </Transition.Child>

          <div>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel>
                <div>
                  <h2>Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span>Close menu</span>
                    <XMarkIcon />
                  </button>
                </div>
                <div>
                  <input type="hidden" name="q" value={q} />
                  {facetFilterTracker.facetsWithValues.map((facet) => (
                    <Disclosure as="div" key={facet.id} defaultOpen={true}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button>
                              <span>{facet.name}</span>
                              <span>
                                {open ? (
                                  <MinusSmallIcon aria-hidden="true" />
                                ) : (
                                  <PlusSmallIcon aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel>
                            <div>
                              {facet.values.map((value, optionIdx) => (
                                <div key={value.id}>
                                  <input
                                    id={`filter-mobile-${facet.id}-${optionIdx}`}
                                    defaultValue={value.id}
                                    type="checkbox"
                                    checked={value.selected}
                                    onChange={(ev) => {
                                      // FIXME: ugly workaround because the dialog is in a portal not within the intended form
                                      (
                                        document.getElementById(
                                          `filter-${facet.id}-${optionIdx}`,
                                        ) as HTMLInputElement
                                      ).checked = ev.target.checked;
                                    }}
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${facet.id}-${optionIdx}`}
                                  >
                                    {value.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div>
        <input type="hidden" name="q" value={q} />
        {facetFilterTracker.facetsWithValues.map((facet) => (
          <Disclosure as="div" key={facet.id} defaultOpen={true}>
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button>
                    <span>{facet.name}</span>
                    <span>
                      {open ? (
                        <MinusSmallIcon aria-hidden="true" />
                      ) : (
                        <PlusSmallIcon />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel>
                  <div>
                    {facet.values.map((value, optionIdx) => (
                      <div key={value.id}>
                        <input
                          id={`filter-${facet.id}-${optionIdx}`}
                          name={`fvid`}
                          defaultValue={value.id}
                          type="checkbox"
                          checked={value.selected}
                          onChange={() => {}}
                        />
                        <label htmlFor={`filter-${facet.id}-${optionIdx}`}>
                          {value.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </>
  );
};

export default FacetFilterControls;
