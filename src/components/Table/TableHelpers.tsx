import React from 'react';
import { useMemo } from 'react';
import { useLocalStorage } from '@bpenwell/rei-module';
import { Box, Button, Header, HeaderProps, SpaceBetween } from '@cloudscape-design/components';

export const TableNoMatchState = ({ onClearFilter }: { onClearFilter: () => void }) => (
    <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
      <SpaceBetween size="xxs">
        <div>
          <b>No matches</b>
          <Box variant="p" color="inherit">
            We can't find a match.
          </Box>
        </div>
        <Button onClick={onClearFilter}>Clear filter</Button>
      </SpaceBetween>
    </Box>
  );
  
  export const TableEmptyState = ({ resourceName }: { resourceName: string }) => (
    <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
      <SpaceBetween size="xxs">
        <div>
          <b>No {resourceName.toLowerCase()}s</b>
          <Box variant="p" color="inherit">
            No {resourceName.toLowerCase()}s associated with this resource.
          </Box>
        </div>
        <Button>Create {resourceName.toLowerCase()}</Button>
      </SpaceBetween>
    </Box>
);

interface FullPageHeaderProps extends HeaderProps {
  title?: string;
  createButtonText?: string;
  extraActions?: React.ReactNode;
  selectedItemsCount: number;
}

export function FullPageHeader({
  title = 'Distributions',
  createButtonText = 'Create distribution',
  extraActions = null,
  selectedItemsCount,
  ...props
}: FullPageHeaderProps) {
  const isOnlyOneSelected = selectedItemsCount === 1;

  return (
    <Header
      variant="awsui-h1-sticky"
      actions={
        <SpaceBetween size="xs" direction="horizontal">
          {extraActions}
          <Button data-testid="header-btn-view-details" disabled={!isOnlyOneSelected}>
            View details
          </Button>
          <Button data-testid="header-btn-edit" disabled={!isOnlyOneSelected}>
            Edit
          </Button>
          <Button data-testid="header-btn-delete" disabled={selectedItemsCount === 0}>
            Delete
          </Button>
          <Button data-testid="header-btn-create" variant="primary">
            {createButtonText}
          </Button>
        </SpaceBetween>
      }
      {...props}
    >
      {title}
    </Header>
  );
}

export const addToColumnDefinitions = (columnDefinitions: any, propertyName: string, columns: any) =>
    columnDefinitions.map((colDef: any) => {
      const column = (columns || []).find((col: any) => col.id === colDef.id);
      return {
        ...colDef,
        [propertyName]: (column && column[propertyName]) || colDef[propertyName],
      };
});

export const mapWithColumnDefinitionIds = (columnDefinitions: { id: string }[], propertyName: string, items: any[]) =>
    //Fix Binding element 'id' implicitly has an 'any' type.ts(7031)
    columnDefinitions.map(({ id }, index) => ({
        id,
        width: items[index],
}));


export function useColumnWidths(storageKey: string, columnDefinitions: any) {
  const [widths, saveWidths] = useLocalStorage(storageKey);

  function handleWidthChange(event: any) {
    saveWidths(mapWithColumnDefinitionIds(columnDefinitions, 'width', event.detail.widths));
  }
  const memoDefinitions = useMemo(() => {
    return addToColumnDefinitions(columnDefinitions, 'width', widths);
  }, [widths, columnDefinitions]);

  return [memoDefinitions, handleWidthChange];
}