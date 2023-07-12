import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FacetFilterTracker from '@/components/facet-filter/facet-filter-tracker';
import { FACET_VALUE_ID_PARAM } from '@/utils/use-filtered-product-search';
import Expander from '@/components/expander';
import Checkbox from '@/components/form/checkbox';
import styles from '@/styles/components/filters.module.css';
import Modal from '@/components/modal/modal';
import Button, { ButtonTray } from '@/components/button';

const FacetFilterControls = ({
  facetFilterTracker,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  facetFilterTracker: FacetFilterTracker;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const existingFacetValueIds = searchParams.getAll(FACET_VALUE_ID_PARAM);

  // Update URL query params when a facet is selected
  const setFacet = (facetValueId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.delete(FACET_VALUE_ID_PARAM);

    let newFacetValueIds: string[] = [];
    if (existingFacetValueIds.includes(facetValueId)) {
      newFacetValueIds = existingFacetValueIds.filter((valueId) => {
        return valueId !== facetValueId;
      });
    } else {
      newFacetValueIds = [...existingFacetValueIds, facetValueId];
    }

    newFacetValueIds.forEach((facetValueId) => {
      current.append(FACET_VALUE_ID_PARAM, facetValueId);
    });

    const search = current.toString();
    const query = `${'?'.repeat(search.length && 1)}${search}`;

    router.push(`${pathname}${query}`);
  };

  return (
    <div className={styles.filters}>
      {/* Mobile filter dialog */}
      <Modal
        isOpen={mobileFiltersOpen}
        close={() => setMobileFiltersOpen(false)}
      >
        <h2>Filters</h2>

        {/*  Mobile facets filters */}
        <div className={styles.mobile}>
          {facetFilterTracker.facetsWithValues.map((facet) => (
            <div key={facet.id} className={styles.facet}>
              <Expander title={facet.name}>
                <ul>
                  {facet.values.map((value, optionIdx) => (
                    <li key={value.id} className={styles.item}>
                      <Checkbox
                        id={`filter-mobile-${facet.id}-${optionIdx}`}
                        checked={value.selected}
                        onChange={() => setFacet(value.id)}
                        name="fvid-mobile"
                        // value={value.id}
                      >
                        <label
                          htmlFor={`filter-mobile-${facet.id}-${optionIdx}`}
                        >
                          {value.name}
                        </label>
                      </Checkbox>
                    </li>
                  ))}
                </ul>
              </Expander>
            </div>
          ))}
        </div>

        <ButtonTray align="right">
          <Button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            role="secondary"
          >
            Done
          </Button>
        </ButtonTray>
      </Modal>

      {/* Desktop filter controls */}
      <div className={styles.desktop}>
        {facetFilterTracker.facetsWithValues.map((facet) => (
          <div key={facet.id} className={styles.facet}>
            <Expander title={facet.name}>
              <ul>
                {facet.values.map((value, optionIdx) => (
                  <li key={value.id} className={styles.item}>
                    <Checkbox
                      key={value.id}
                      id={`filter-${facet.id}-${optionIdx}`}
                      name="fvid"
                      checked={value.selected}
                      // value={value.id}
                      onChange={() => setFacet(value.id)}
                    >
                      <label htmlFor={`filter-${facet.id}-${optionIdx}`}>
                        {value.name}
                      </label>
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </Expander>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacetFilterControls;
