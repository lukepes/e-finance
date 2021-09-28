import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import classes from './SideDrawer.module.scss';

const SideDrawer = ({ drawerOpen, closeDrawerHandler, children }) => {
  let classList = [classes.backdrop];

  if (drawerOpen) {
    classList = [...classList, classes.open];
  }

  const classNames = classList.join(' ');

  return ReactDOM.createPortal(
    <div className={classNames}>
      <button className={classes.close} onClick={closeDrawerHandler}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <aside className={classes.sidenav} onClick={closeDrawerHandler}>
        {children}
      </aside>
    </div>,
    document.getElementById('side-drawer')
  );
};

SideDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  closeDrawerHandler: PropTypes.func.isRequired,
};

export default SideDrawer;
