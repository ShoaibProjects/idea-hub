import React, { ReactNode} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { closeModal } from '../../../Redux-slices/searchSlice/searchSlice';

import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({  children }) => {

  const isOpen = useSelector((state: RootState) => state.search.isOpen);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeModal())}>
      <div
        className="modal-content"
      >
        <button className="close-button" onClick={() => dispatch(closeModal())}>
          &times;
        </button>
        <div className='modal-cont'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
