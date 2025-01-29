import React, { useRef } from 'react';
import { useMemo } from 'react';
import { PAGE_PATH, RedirectAPI, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import { Box, Button, Header, HeaderProps, SpaceBetween, Alert } from '@cloudscape-design/components';
import { DeleteWithConfirmation, Item } from '../DeleteWithConfirmation/DeleteWithConfirmation';
import { useAppContext } from '../../utils/AppContextProvider';

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

export const TableEmptyState = ({ resourceName }: { resourceName: string }) => {
  const redirectAPI = new RedirectAPI();
  const redirectToCreate = () => {
    redirectAPI.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_CREATE);
  };
  const { canCreateNewReport } = useAppContext();

  return (
    <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
      <SpaceBetween size="xxs">
          {
            !canCreateNewReport() ? (
              <Alert
                header="You have reached your maximum number of free reports."
                type="error"
              >
                To create a new report, please upgrade your plan.
              </Alert>
            ) : (
              <div>
                <b>No {resourceName.toLowerCase()}s</b>
                <Box variant="p" color="inherit">
                  No {resourceName.toLowerCase()}s associated with this address.
                </Box>
              </div>
            )
          }
        <Button onClick={redirectToCreate} disabled={!canCreateNewReport()}>Create {resourceName.toLowerCase()}</Button>
      </SpaceBetween>
    </Box>
  );
}

interface FullPageHeaderProps extends HeaderProps {
  title?: string;
  createButtonText?: string;
  extraActions?: React.ReactNode;
  selectedItems: readonly Item[];
  handleDelete: () => void;
}

export function FullPageHeader({
  title = 'Reports',
  createButtonText = 'Create report',
  handleDelete,
  extraActions = null,
  selectedItems,
  ...props
}: FullPageHeaderProps) {
  const { canCreateNewReport, getRemainingFreeRentalReports, isPaidMember } = useAppContext();
  const isOnlyOneSelected = selectedItems.length === 1;
  const redirectAPI = new RedirectAPI();

  const redirectToCreate = () => {
    redirectAPI.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_CREATE);
  };
  
  const redirectToEdit = () => {
    redirectAPI.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_EDIT + `/${selectedItems[0].id}` as PAGE_PATH);
  };

  const deleteWithConfirmationRef = useRef<{ openModal: () => void }>(null);

  const handleDeleteButtonClicked = () => {
    if (deleteWithConfirmationRef.current) {
      deleteWithConfirmationRef.current.openModal();
    }
  };

  return (
    <>
      <Header
        variant="awsui-h1-sticky"
        actions={
          <SpaceBetween size="xs" direction="horizontal">
            {extraActions}
            <Button data-testid="header-btn-edit" disabled={!isOnlyOneSelected} onClick={redirectToEdit}>
              Edit
            </Button>
            <Button data-testid="header-btn-delete" disabled={selectedItems.length === 0} onClick={handleDeleteButtonClicked}>
              Delete
            </Button>
            <DeleteWithConfirmation
              itemFieldNameForName='address'
              itemType='report'
              ref={deleteWithConfirmationRef}
              itemsToDelete={selectedItems}
              onDeleteConfirmed={handleDelete}
            />

            <Button data-testid="header-btn-create" variant="primary" onClick={redirectToCreate} disabled={!canCreateNewReport()}>
              {createButtonText}
            </Button>
          </SpaceBetween>
        }
        {...props}
      >
        {title}
      </Header>
    </>
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