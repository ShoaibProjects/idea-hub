import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import IdeaArea from '../../components/ideaArea/ideaArea';
const IdeaOpen: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <IdeaArea></IdeaArea>
      </main>
    </div>
    </>
  );
}

export default IdeaOpen;
