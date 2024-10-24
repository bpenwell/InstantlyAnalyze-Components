import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Modal, Box, SpaceBetween, Alert, Link } from '@cloudscape-design/components';

export interface Item {
  id: string;
  [key: string]: any; // Include additional properties as needed
}

interface IDeleteWithConfirmationProps {
  itemType?: string;
  /**
   * Is the string mapping to get to the desired display name
   * i.e.: 'address'
   */
  itemFieldNameForName?: string;
  itemsToDelete: readonly Item[];
  onDeleteConfirmed: (items: Item[]) => void;
}

export const DeleteWithConfirmation = forwardRef<{
  openModal: () => void;
}, IDeleteWithConfirmationProps>((props, ref) => {
  const { itemsToDelete, onDeleteConfirmed, itemType, itemFieldNameForName } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  //Singular wording
  const itemNameToDisplay = itemType ? itemType : 'item';

  const isMultiple = itemsToDelete.length > 1;

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setShowDeleteModal(true);
    },
  }));

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (onDeleteConfirmed) {
      onDeleteConfirmed(itemsToDelete as any);
    }
  };

  return (
    <Modal
      visible={showDeleteModal}
      onDismiss={handleCancel}
      header={isMultiple ? 'Delete items' : 'Delete item'}
      closeAriaLabel="Close dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        {isMultiple ? (
          <Box variant="span">
            Are you sure you want to delete{' '}
            <Box variant="span" fontWeight="bold">
              {itemsToDelete.length} {itemNameToDisplay}s
            </Box>
            ? This action cannot be undone.
          </Box>
        ) : (
          <Box variant="span">
            Are you sure you want to delete {itemNameToDisplay}{' '}
            <Box variant="span" fontWeight="bold">
              {itemFieldNameForName ? itemsToDelete[0]?.[itemFieldNameForName] : itemsToDelete[0]?.id}
            </Box>
            ? This action cannot be undone.
          </Box>
        )}

        <Alert statusIconAriaLabel="Info">
          Deleting {isMultiple ? 'these items' : 'this item'} will remove all associated data.{' '}
          {/*<Link external href="#" ariaLabel="Learn more, opens in new tab">
            Learn more
          </Link>*/}
        </Alert>
      </SpaceBetween>
    </Modal>
  );
});