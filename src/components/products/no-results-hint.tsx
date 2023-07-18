import Message from '@/components/message';
import FacetFilterTracker from '@/components/facet-filter/facet-filter-tracker';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NoResultsHint = ({
  facetFilterTracker,
}: {
  facetFilterTracker: FacetFilterTracker;
}) => {
  const hasSomeFiltersEnabled = facetFilterTracker?.facetsWithValues.some(
    (facet) => facet.values.some((value) => value.selected),
  );

  return (
    <div>
      <Message
        type="info"
        size="large"
        headingText="No results"
        icon={<MagnifyingGlassIcon width={20} height={20} />}
        text={
          hasSomeFiltersEnabled
            ? 'Try changing your filter settings.'
            : 'Sorry, please try searching for something else.'
        }
      />
    </div>
  );
};

export default NoResultsHint;
