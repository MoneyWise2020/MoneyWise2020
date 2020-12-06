import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { IApiRuleMutate, IApiRule } from './IRule';
import { ModifyForm } from './ModifyRuleForm';

export const Modal = ({
    rule,
    onClickOutside = (event: any) => {},
    onKeyDown = (event: any) => {},
    modalRef = (n: any) => {},
    buttonRef = (n: any) => {},
    closeModal = () => {},
    onSubmit,
    onDelete = () => {}
} : {
    rule: IApiRule,
    onClickOutside: (event: any) => void
    onKeyDown: (event: any) => void
    modalRef: (n: any) => void
    buttonRef: (n: any) => void
    closeModal: () => void
    onSubmit: (id: string, rule: IApiRuleMutate) => void
    onDelete?: (id: string) => void
}) => {
return ReactDOM.createPortal(
<FocusTrap>
  <aside
//   tag="aside"
  role="dialog"
//   tabIndex="-1".toFixed()
  aria-modal="true"
  className="modal-cover"
  onClick={onClickOutside}
  onKeyDown={onKeyDown}
>
    <div className="modal-area" ref={modalRef}>
    <button
    ref={buttonRef}
    aria-label="Close Modal"
    aria-labelledby="close-modal"
    className="_modal-close"
    onClick={closeModal}
    >
    <span id="close-modal" className="_hide-visual">
    Close
    </span>
    <svg className="_modal-close-icon" viewBox="0 0 40 40">
    <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
    </svg>
    </button>
<div className="modal-body">
   <ModifyForm rule={rule} onSubmit={onSubmit} onDelete={onDelete} onFailedValidation={closeModal} />
  </div>
   </div>
   </aside>
 </FocusTrap>,
document.body
);
};
export default Modal;