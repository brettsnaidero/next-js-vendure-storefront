import { SearchFacetValuesQuery, SearchQuery } from '@/graphql-types.generated';

interface FacetWithValues {
  id: string;
  name: string;
  values: Array<{
    id: string;
    name: string;
    selected: boolean;
  }>;
}

// What does this do?
class FacetFilterTracker {
  private _facetsWithValues: FacetWithValues[] = [];

  get facetsWithValues() {
    return this._facetsWithValues;
  }

  update(
    activeFacetValueIds: string[],
    searchResult: SearchQuery['search'],
    resultWithoutFacetValueFilters?: SearchFacetValuesQuery['search'],
  ) {
    this._facetsWithValues = this.groupFacetValues(
      activeFacetValueIds,
      searchResult?.facetValues,
      resultWithoutFacetValueFilters,
    );
  }

  private groupFacetValues(
    activeFacetValueIds: string[],
    current?: SearchQuery['search']['facetValues'],
    withoutFilters?: SearchFacetValuesQuery['search'],
  ): FacetWithValues[] {
    if (!current) {
      return [];
    }

    const facetMap = new Map<string, FacetWithValues>();

    for (const {
      facetValue: { id, name, facet },
      count,
    } of withoutFilters?.facetValues || []) {
      if (count === withoutFilters?.totalItems) {
        continue;
      }

      const facetFromMap = facetMap.get(facet.id);
      const selected = activeFacetValueIds.includes(id);

      if (facetFromMap) {
        facetFromMap.values.push({ id, name, selected });
      } else {
        facetMap.set(facet.id, {
          id: facet.id,
          name: facet.name,
          values: [{ id, name, selected }],
        });
      }
    }
    return Array.from(facetMap.values());
  }
}

export default FacetFilterTracker;
