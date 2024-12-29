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
  // Prevent scrolling when the modal is open
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }

  //   return () => {
  //     document.body.style.overflow = 'auto';
  //   };
  // }, [isOpen]);

  const isOpen = useSelector((state: RootState) => state.search.isOpen);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeModal())}>
      <div
        className="modal-content"
        // onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
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
