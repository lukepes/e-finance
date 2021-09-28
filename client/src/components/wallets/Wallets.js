import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useRequest from '../../hooks/useRequest';

import Wallet from './Wallet';
import Modal from '../layout/Modal';
import Spinner from '../layout/Spinner';

import classes from './Wallets.module.scss';

const initialState = {
  walletsList: [],
  activeWalletId: null,
  markedForDeletion: false,
  loading: false,
  error: null,
};

const walletsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WALLETS_LIST':
      return {
        ...state,
        walletsList: action.payload,
        markedForDeletion: false,
      };
    case 'SET_ACTIVE_WALLET':
      return {
        ...state,
        activeWalletId: action.payload,
      };
    case 'SET_MARKED_FOR_DELETION':
      return {
        ...state,
        markedForDeletion: action.payload,
      };
    default:
      return state;
  }
};

const Wallets = () => {
  const [state, dispatch] = useReducer(walletsReducer, initialState);

  const { loading, error, makeRequest, clearError } = useRequest();

  useEffect(() => {
    const getRequestCallback = (response) => {
      dispatch({ type: 'SET_WALLETS_LIST', payload: response.data });
    };

    makeRequest(
      {
        method: 'get',
        url: process.env.REACT_APP_BACKEND_URL + '/wallets',
      },
      getRequestCallback
    );
  }, [makeRequest]);

  const setActiveWalletId = (id) => {
    dispatch({
      type: 'SET_ACTIVE_WALLET',
      payload: id,
    });
  };

  const setWalletForDeletionHandler = () => {
    dispatch({
      type: 'SET_MARKED_FOR_DELETION',
      payload: true,
    });
  };

  const cancelWalletDeletionHandler = () => {
    dispatch({
      type: 'SET_MARKED_FOR_DELETION',
      payload: false,
    });
  };

  const confirmWalletDeletionHandler = async () => {
    const deleteRequestCallback = (response) => {
      if (response.status === 200) {
        const newWalletsList = state.walletsList.filter(
          (wallet) => wallet._id !== state.activeWalletId
        );
        dispatch({
          type: 'SET_WALLETS_LIST',
          payload: newWalletsList,
        });
      }
    };

    makeRequest(
      {
        method: 'delete',
        url:
          process.env.REACT_APP_BACKEND_URL +
          `/wallets/${state.activeWalletId}`,
      },
      deleteRequestCallback
    );
  };

  if (loading) {
    return (
      <div className={classes.container}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Modal
        title="Error"
        message={`${error.status}: ${error.statusText}`}
        confirmText="Back"
        confirmAction={clearError}
      />
    );
  }

  if (state.walletsList.length === 0) {
    return (
      <div className={classes.message}>
        <h2 className={classes['message-header']}>
          You do not have any wallet yet
        </h2>
        <p className={classes['message-paragraph']}>
          Add a wallet to start managing your finances more consciously
        </p>
        <Link to="/wallets/new" className={classes.link}>
          Add a Wallet
        </Link>
      </div>
    );
  }

  const displayedWallets = state.walletsList.map((wallet) => (
    <Wallet
      key={wallet._id}
      id={wallet._id}
      name={wallet.name}
      currency={wallet.currency}
      balance={wallet.balance.toFixed(2)}
      activeWalletId={state.activeWalletId}
      onActivateWallet={setActiveWalletId}
      onDeleteWallet={setWalletForDeletionHandler}
    />
  ));

  return (
    <>
      <div className={classes.container}>
        {displayedWallets}
        <Link to="/wallets/new" className={classes.link}>
          Add a Wallet
        </Link>
      </div>

      {state.markedForDeletion && (
        <Modal
          confirmText="Confirm"
          confirmAction={confirmWalletDeletionHandler}
          canceltext="Cancel"
          cancelAction={cancelWalletDeletionHandler}
        />
      )}
    </>
  );
};

export default Wallets;
