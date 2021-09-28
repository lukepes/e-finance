import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useParams } from 'react-router-dom';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';

import Form from '../layout/forms&inputs/Form';
import Input from '../layout/forms&inputs/Input';
import RadioInputs from '../layout/forms&inputs/RadioInputs';
import ToggleInput from '../layout/forms&inputs/ToggleInput';
import Button from '../layout/Button';
import Spinner from '../layout/Spinner';
import Modal from '../layout/Modal';

import classes from './WalletForm.module.scss';

const WalletForm = ({ mode }) => {
  const history = useHistory();
  const params = useParams();

  const { loading, error, makeRequest, clearError } = useRequest();

  const nameValidation = (value) => {
    return /\S+/.test(value) && value.length < 24;
  };
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    setValueHandler: nameSetValueHandler,
    changeHandler: nameChangeHandler,
    blurHandler: nameBlurHandler,
    validateHandler: nameValidateHandler,
  } = useInput(nameValidation);

  const currencyValidation = (value) => {
    return mode === 'edit' ? true : value.length > 0;
  };
  const {
    value: currencyValue,
    isValid: currencyIsValid,
    hasError: currencyHasError,
    changeHandler: currencyChangeHandler,
    validateHandler: currencyValidateHandler,
  } = useInput(currencyValidation);

  const balanceValidation = (value) => {
    return mode === 'edit' ? true : /^\d+(\.\d{1,2})?$/.test(value);
  };
  const {
    value: balanceValue,
    isValid: balanceIsValid,
    hasError: balanceHasError,
    setValueHandler: balanceSetValueHandler,
    changeHandler: balanceChangeHandler,
    blurHandler: balanceBlurHandler,
    validateHandler: balanceValidateHandler,
  } = useInput(balanceValidation);

  const debitValidation = (checkboxChecked) => {
    return mode === 'edit' ? checkboxChecked || balanceValue >= 0 : true;
  };
  const {
    checkboxChecked: allowDebit,
    isValid: debitIsValid,
    hasError: debitHasError,
    checkboxChangeHandler: debitChangeHandler,
    checkboxSetHandler: setAllowDebit,
    validateHandler: debitValidateHandler,
  } = useInput(debitValidation, true);

  useEffect(() => {
    if (mode === 'edit') {
      const getRequestCallback = (response) => {
        nameSetValueHandler(response.data.name);
        setAllowDebit(response.data.allowDebit);
        balanceSetValueHandler(response.data.balance.toFixed(2));
      };

      makeRequest(
        {
          method: 'get',
          url: process.env.REACT_APP_BACKEND_URL + `/wallets/${params.id}`,
        },
        getRequestCallback
      );
    }
  }, [
    mode,
    params.id,
    nameSetValueHandler,
    balanceSetValueHandler,
    setAllowDebit,
    makeRequest,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formIsValid =
      nameIsValid && currencyIsValid && balanceIsValid && debitIsValid;

    if (!formIsValid) {
      nameValidateHandler();
      currencyValidateHandler();
      balanceValidateHandler();
      debitValidateHandler();
      return;
    }

    const otherRequestsHandler = (response) => {
      if (response.status === 200 || response.status === 201) {
        history.push('/wallets');
      }
    };

    if (mode === 'edit') {
      makeRequest(
        {
          method: 'patch',
          url: process.env.REACT_APP_BACKEND_URL + `/wallets/${params.id}`,
          data: {
            name: nameValue,
            allowDebit: allowDebit,
          },
        },
        otherRequestsHandler
      );
    } else {
      makeRequest(
        {
          method: 'post',
          url: process.env.REACT_APP_BACKEND_URL + '/wallets',
          data: {
            name: nameValue,
            currency: currencyValue,
            balance: balanceValue,
            allowDebit: allowDebit,
          },
        },
        otherRequestsHandler
      );
    }
  };

  let content = loading ? (
    <Spinner />
  ) : error ? (
    <Modal
      title="Error"
      message={`${error.status}: ${error.statusText}`}
      confirmText="Back"
      confirmAction={clearError}
    />
  ) : (
    <>
      <Input
        name="name"
        label="Wallet Name"
        disabled={false}
        errorMessage="Name must be provided and have less than 24 characters"
        type="text"
        value={nameValue}
        changeHandler={nameChangeHandler}
        blurHandler={nameBlurHandler}
        hasError={nameHasError}
      />
      <RadioInputs
        name="currency"
        label="Currency"
        disabled={mode === 'edit' && true}
        errorMessage="Please choose one of the available options"
        buttons={['pln', 'usd', 'eur']}
        labels={['PLN', 'USD', 'EUR']}
        value={currencyValue}
        changeHandler={currencyChangeHandler}
        hasError={currencyHasError}
      />
      <Input
        name="balance"
        label="Starting balance"
        disabled={mode === 'edit' && true}
        errorMessage="Please provide a valid number"
        type="number"
        value={balanceValue}
        changeHandler={balanceChangeHandler}
        blurHandler={balanceBlurHandler}
        hasError={balanceHasError}
      />
      <ToggleInput
        name="debit"
        label="Allow Debit"
        checkboxChecked={allowDebit}
        changeHandler={debitChangeHandler}
        hasError={debitHasError}
      />
      <Button
        type="submit"
        text={mode === 'edit' ? 'Update Wallet' : 'Add Wallet'}
        wide={true}
        alternative={false}
      />
      <Link to="/wallets" className={classes.link}>
        Cancel
      </Link>
    </>
  );

  return <Form onSubmit={submitHandler}>{content}</Form>;
};

WalletForm.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default WalletForm;
