import React from "react";
import IdeaForm from "../../components/IdeaFrom/IdeaForm";
import MainLayout from "../../MainLayout";

const IdeaPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <IdeaForm></IdeaForm>
      </MainLayout>
    </>
  );
};

export default IdeaPage;
