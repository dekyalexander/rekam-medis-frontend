import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

const ActionConfirmation = (props) => {
  const { handleClose, onAction, actionName } = props;

  const onOk = () => {
    onAction();
    handleClose();
  };

  return (
    <>
      <DialogTitle id="form-dialog-title">{actionName} Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {' '}
          Are you sure want to {actionName}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOk} color="secondary">
          {actionName}
        </Button>
        <Button variant="contained" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
};

export default ActionConfirmation;
