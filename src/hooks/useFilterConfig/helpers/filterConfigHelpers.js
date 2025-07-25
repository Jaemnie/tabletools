import { defaultPlaceholder, stringToId } from './helpers';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const isCustomFilter = (type) =>
  !Object.keys(conditionalFilterType).includes(type);

const getActiveFilters = (configItem, activeFilters, filterTypeHelpers) =>
  filterTypeHelpers?.getActiveFilterValues?.(configItem, activeFilters) ||
  activeFilters?.[stringToId(configItem.label)];

const toFilterConfigItem = (
  configItem,
  filterTypeHelpers,
  handler,
  activeFilters,
  openFilterModal,
) => {
  const value = getActiveFilters(configItem, activeFilters, filterTypeHelpers);
  const filterValues = filterTypeHelpers.filterValues(
    configItem,
    handler,
    value,
    openFilterModal,
  );

  return filterValues
    ? {
        type: isCustomFilter(configItem.type)
          ? conditionalFilterType.custom
          : configItem.type,
        label: configItem.label,
        className: configItem.className, // TODO questionable... maybe add a props prop
        placeholder:
          configItem?.placeholder ?? defaultPlaceholder(configItem.label),
        filterValues,
      }
    : undefined;
};

export const toIdedFilters = (configItem) => ({
  ...configItem,
  id: stringToId(configItem.label),
});

export const toFilterConfig = (
  filterConfig,
  filterTypes,
  activeFilters,
  handler,
  openFilterModal,
) => ({
  items: filterConfig
    .map(toIdedFilters)
    .map((configItem) =>
      filterTypes[configItem.type]
        ? toFilterConfigItem(
            configItem,
            filterTypes[configItem.type],
            handler,
            activeFilters,
            openFilterModal,
          )
        : undefined,
    )
    .filter((v) => !!v),
});

export const getFilterConfigItem = (filterConfig, filter) =>
  filterConfig.find(
    (configItem) => stringToId(configItem.label) === stringToId(filter),
  );

export const toSelectValue = (
  filterConfig,
  filterTypes,
  filter,
  selectedValue,
  selectedValues,
) => {
  const configItem = getFilterConfigItem(filterConfig, filter);

  return filterTypes[configItem.type].toSelectValue(
    configItem,
    selectedValues,
    selectedValue,
  );
};
