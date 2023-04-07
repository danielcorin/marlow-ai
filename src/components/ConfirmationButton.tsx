import React, { useState } from "react";
import { Button } from "antd";

interface ConfirmationButtonProps {
  initialText: string;
  confirmationText: string;
  actionOnConfirm: () => void;
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({ initialText, confirmationText, actionOnConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = (action: () => void) => {
    if (confirmed) {
      action()
      setConfirmed(false)
    } else {
      setConfirmed(true)
    }
  };

  return (
    <Button danger={confirmed} onClick={() => handleConfirm(actionOnConfirm)}>
      {confirmed ? confirmationText : initialText}
    </Button>
  )
};

export default ConfirmationButton
