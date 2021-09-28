import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import compareDates from '../../utils/compareDates';

import useRequest from '../../hooks/useRequest';

import OneDayOperations from './OneDayOperations';
import Spinner from '../layout/Spinner';
import Modal from '../layout/Modal';

import classes from './Operations.module.scss';

const Operations = () => {
  const [wallet, setWallet] = useState(null);
  const [operationMarkedForDeletion, setOperationMarkedForDeletion] =
    useState(null);

  const params = useParams();

  const { loading, error, makeRequest, clearError } = useRequest();

  const getRequestCallback = (response) => {
    setWallet(response.data);
  };

  useEffect(() => {
    makeRequest(
      {
        method: 'get',
        url:
          process.env.REACT_APP_BACKEND_URL +
          `/wallets/${params.walletId}/operations`,
      },
      getRequestCallback
    );
  }, [params.walletId, makeRequest]);

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

  let transformedBalance;

  if (wallet) {
    if (wallet.currency === 'pln') {
      transformedBalance = `${wallet.balance.toFixed(2)} PLN`;
    } else {
      transformedBalance =
        wallet.currency === 'usd'
          ? `$${wallet.balance.toFixed(2)}`
          : `€${wallet.balance.toFixed(2)}`;
    }
  }

  if (wallet && !wallet.operations.length > 0) {
    return (
      <div className={classes.container}>
        <p className={classes.message}>No operation history for this wallet</p>
        <Link to={`/${wallet._id}/operations/new`} className={classes.link}>
          Add an operation
        </Link>
      </div>
    );
  }

  if (wallet && wallet.operations.length > 0) {
    const compareOperations = (op1, op2) => {
      const date1 = new Date(op1.createdAt);
      const date2 = new Date(op2.createdAt);
      return compareDates(date1, date2);
    };

    const { operations } = wallet;
    let transformedOperations;
    let displayedOperations;

    transformedOperations = [[operations[0]]];

    for (let i = 1; i < operations.length; i++) {
      if (!compareOperations(operations[i], operations[i - 1])) {
        transformedOperations = [...transformedOperations, [operations[i]]];
      } else {
        transformedOperations[transformedOperations.length - 1] = [
          ...transformedOperations[transformedOperations.length - 1],
          operations[i],
        ];
      }
    }

    const setForDeletionHandler = (id) => {
      setOperationMarkedForDeletion(id);
    };

    const confirmOperationDeletionHandler = () => {
      const deleteRequestCallback = (response) => {
        if (response.status) {
          let operationData;
          const newOperationsList = wallet.operations.filter((operation) => {
            if (operation._id === operationMarkedForDeletion) {
              operationData = {
                value: operation.value,
                type: operation.type,
              };
            }
            return operation._id !== operationMarkedForDeletion;
          });
          const newBalance =
            operationData.type === 'incoming'
              ? wallet.balance - operationData.value
              : wallet.balance + operationData.value;

          setWallet((prevWallet) => ({
            ...prevWallet,
            balance: newBalance,
            operations: newOperationsList,
          }));
        }
      };
      makeRequest(
        {
          method: 'delete',
          url:
            process.env.REACT_APP_BACKEND_URL +
            `/operations/${operationMarkedForDeletion}`,
        },
        deleteRequestCallback
      );
      setOperationMarkedForDeletion(null);
    };

    const cancelOperationDeletionHandler = () => {
      setOperationMarkedForDeletion(null);
    };

    if (operationMarkedForDeletion) {
      return (
        <Modal
          confirmText="Confirm"
          confirmAction={confirmOperationDeletionHandler}
          canceltext="Cancel"
          cancelAction={cancelOperationDeletionHandler}
        />
      );
    }

    displayedOperations = transformedOperations.map((day) => {
      const date = day[0].createdAt;
      return (
        <OneDayOperations
          key={date}
          walletId={wallet._id}
          date={date}
          operationsList={day}
          currency={wallet.currency}
          onDelete={setForDeletionHandler}
        />
      );
    });

    return (
      <div className={classes.container}>
        <h3 className={classes['wallet-data']}>
          <span className={classes['wallet-name']}>{wallet.name}</span>
          <span className={classes['wallet-balance']}>
            {transformedBalance}
          </span>
        </h3>
        {displayedOperations}
        <Link to={`/${wallet._id}/operations/new`} className={classes.link}>
          Add an operation
        </Link>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <p className={classes.message}>No wallet could be found</p>
      <Link to={'/wallets'} className={classes.link}>
        Return to Wallets page
      </Link>
    </div>
  );
};

export default Operations;
