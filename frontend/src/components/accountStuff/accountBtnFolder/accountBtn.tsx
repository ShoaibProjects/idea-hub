import React, { useState } from 'react';
import { User } from "lucide-react";
import AccountModal from '../accountModal/accountModal';

const AccountBtn: React.FC = () => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle modal open/close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Button to toggle modal */}
      <button onClick={toggleModal}>
        <User />
      </button>

      {/* Modal, only rendered if isModalOpen is true */}
      {isModalOpen && <AccountModal onClose={toggleModal} />}
    </>
  );
};

export default AccountBtn;
