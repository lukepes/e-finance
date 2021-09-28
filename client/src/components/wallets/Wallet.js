import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPen,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

import classes from './Wallet.module.scss';

const Wallet = ({
  id,
  name,
  currency,
  balance,
  activeWalletId,
  onActivateWallet,
  onDeleteWallet,
}) => {
  const history = useHistory();

  let displayedBalance;

  if (currency === 'pln') {
    displayedBalance = `${balance} PLN`;
  } else {
    displayedBalance = currency === 'usd' ? `$${balance}` : `€${balance}`;
  }

  const isActive = id === activeWalletId;

  const wrapperClasses = isActive
    ? `${classes.wrapper} ${classes.active}`
    : `${classes.wrapper}`;

  const activationHandler = () => {
    if (isActive) {
      onActivateWallet(null);
    } else {
      onActivateWallet(id);
    }
  };

  const historyHandler = (e) => {
    e.stopPropagation();
    history.push(`${id}/operations`);
  };

  const editHandler = (e) => {
    e.stopPropagation();
    history.push(`/wallets/edit/${id}`);
  };

  const deleteWalletHandler = (e) => {
    e.stopPropagation();
    onDeleteWallet();
  };

  return (
    <div
      data-testid="wallet"
      className={wrapperClasses}
      onClick={activationHandler}
    >
      <div className={classes.info}>
        <h3 className={classes.name}>{name}</h3>
        <div data-testid="balance" className={classes.balance}>
          {displayedBalance}
        </div>
      </div>
      {isActive && (
        <div className={classes.actions}>
          <button
            type="button"
            className={classes.btn}
            onClick={historyHandler}
          >
            <FontAwesomeIcon icon={faClipboardList} className={classes.icon} />
          </button>
          <button type="button" className={classes.btn} onClick={editHandler}>
            <FontAwesomeIcon
              icon={faPen}
              className={`${classes.icon} ${classes['icon--edit']}`}
            />
          </button>
          <button
            type="button"
            className={classes.btn}
            onClick={deleteWalletHandler}
          >
            <FontAwesomeIcon
              className={`${classes.icon} ${classes['icon--danger']}`}
              icon={faTimes}
            />
          </button>
        </div>
      )}
    </div>
  );
};

Wallet.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  activeWalletId: PropTypes.string,
  onActivateWallet: PropTypes.func.isRequired,
  onDeleteWallet: PropTypes.func.isRequired,
};

export default Wallet;
