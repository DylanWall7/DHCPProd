import React from "react";
import { Modal, ModalContent, Progress } from "@nextui-org/react";

const ScopeLoading = ({ loading }) => {
  return (
    <>
      <Modal isOpen={loading} onClose={!loading}>
        <ModalContent>
          <Progress
            size="sm"
            isIndeterminate
            color="success"
            aria-label="Loading..."
            className="max-w-md"
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScopeLoading;
