import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { useState } from 'react';


function CheckModalComponent(props) {

    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };
    const modalAccept = () => {

    };
  
  return (
    <div className="check-modal">
        <Modal
        open={props.open}
        onClose={props.handleCloseModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
            <h2 id="child-modal-title">Bạn có chắc chắn muốn xóa không?</h2>
            <button className="btn btn-success mr-4" onClick={props.modalAccept}>OK</button>
            <button className="btn btn-danger" onClick={props.handleCloseModal}>Đóng</button>
            </Box>
        </Modal>
    </div>
  );
}

export default CheckModalComponent;