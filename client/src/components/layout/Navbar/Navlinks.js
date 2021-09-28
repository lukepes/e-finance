import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import classes from './Navlinks.module.scss';

const Navlinks = ({ logoutHandler }) => {
  return (
    <ul className={classes.navigation}>
      <li className={classes['navigation-item']}>
        <NavLink to="/wallets">My Wallets</NavLink>
      </li>
      <li className={classes['navigation-item']}>
        <button onClick={logoutHandler}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </li>
    </ul>
  );
};

Navlinks.propTypes = {
  logoutHandler: PropTypes.func.isRequired,
};

export default Navlinks;
