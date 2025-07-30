import React, { useState } from 'react';
import { User } from "lucide-react";
import AccountModal from '../accountModal/accountModal';

const AccountBtn: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button onClick={toggleModal}>
        <User />
      </button>

      {isModalOpen && <AccountModal onClose={toggleModal} />}
    </>
  );
};

export default AccountBtn;
