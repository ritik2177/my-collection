'use client';

import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import RegisterForm from '@/components/registration'; // adjust path if needed

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 2,
};

interface RegisterModalProps {
  open: boolean;
  handleClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <RegisterForm handleClose={handleClose} />
      </Box>
    </Modal>
  );
};

export default RegisterModal;
