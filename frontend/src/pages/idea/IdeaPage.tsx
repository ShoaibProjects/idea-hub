import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import IdeaForm from '../../components/IdeaFrom/IdeaForm';
const IdeaPage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        <RightAside></RightAside>
        <IdeaForm></IdeaForm>
      </main>
    </div>
    </>
  );
}

export default IdeaPage;
