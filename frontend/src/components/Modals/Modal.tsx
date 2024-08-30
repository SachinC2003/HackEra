import React, { ReactNode } from 'react';
import '../../styles/modal.css';

interface ModalProps {
  isOpen: boolean;
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, header, content, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {header!=null && <div className="modal-header">
          {header}
        </div>}
        <div className="modal-content">
          {content}
        </div>
        {footer!=null && <div className="modal-footer">
          {footer}
        </div>}
      </div>
    </div>
  );
};

export default Modal;
