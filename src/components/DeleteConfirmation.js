import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

const DeleteConfirmation = (props) => {
  const { handleClose, handleDelete, selectedIds, title } = props;

  const onDelete = () => {
    handleDelete();
    handleClose();
  };

  return (
    <>
      <DialogTitle id="form-dialog-title">Konfirmasi Hapus</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {' '}
          Are you sure want to delete {selectedIds.length} {title}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="secondary">
          Hapus
        </Button>
        <Button variant="contained" onClick={handleClose} color="primary">
          Batal
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteConfirmation;
