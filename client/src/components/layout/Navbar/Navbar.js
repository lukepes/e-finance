import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import AuthContext from '../../../context/auth-context';

import Navlinks from './Navlinks';
import SideDrawer from './SideDrawer';

import classes from './Navbar.module.scss';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const drawerOpenHandler = () => {
    setDrawerOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerOpen(false);
  };

  const mobileLogoutHandler = () => {
    setDrawerOpen(false);
    logout();
  };

  return (
    <div className={classes.navbar}>
      <div className={classes.container}>
        <Link to="/wallets" className={classes.navbar__link}>
          <h1 className={classes.logo}>eFinance</h1>
        </Link>
        {isAuthenticated && (
          <nav className={classes['navigation-desktop']}>
            <Navlinks logoutHandler={logout} />
          </nav>
        )}
        {isAuthenticated && (
          <>
            <button
              className={classes['mobile-nav-button']}
              onClick={drawerOpenHandler}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            <SideDrawer
              drawerOpen={drawerOpen}
              closeDrawerHandler={closeDrawerHandler}
            >
              <Navlinks logoutHandler={mobileLogoutHandler} />
            </SideDrawer>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
