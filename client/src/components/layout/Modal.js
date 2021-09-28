import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Button from './Button';

import classes from './Modal.module.scss';

const Modal = ({
  title,
  message,
  confirmText,
  canceltext,
  confirmAction,
  cancelAction,
}) => {
  const backdropRef = useRef();

  const cancelHandler = (e) => {
    e.stopPropagation();

    if (backdropRef.current !== e.target) {
      return;
    }

    cancelAction();
  };

  return ReactDOM.createPortal(
    <div ref={backdropRef} className={classes.backdrop} onClick={cancelHandler}>
      <div className={classes.modal}>
        <h3 className={classes['modal-header']}>{title}</h3>
        <p className={classes['modal-message']}>{message}</p>
        <div className={classes.actions}>
          <Button
            type="button"
            text={confirmText}
            wide={false}
            alternative={false}
            clickHandler={confirmAction}
          />
          {cancelAction && (
            <Button
              type="button"
              text={canceltext}
              wide={false}
              alternative={true}
              clickHandler={cancelAction}
            />
          )}
        </div>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  canceltext: PropTypes.string,
  confirmAction: PropTypes.func.isRequired,
  cancelAction: PropTypes.func,
};

Modal.defaultProps = {
  title: 'Are you sure?',
  message: 'This operation cannot be undone...',
};

export default Modal;
