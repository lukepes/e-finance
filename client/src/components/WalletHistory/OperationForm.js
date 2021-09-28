import React, { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';

import Form from '../layout/forms&inputs/Form';
import Input from '../layout/forms&inputs/Input';
import RadioInputs from '../layout/forms&inputs/RadioInputs';
import Button from '../layout/Button';
import Spinner from '../layout/Spinner';
import Modal from '../layout/Modal';

import classes from './OperationForm.module.scss';

const HistoryForm = ({ mode }) => {
  const history = useHistory();
  const params = useParams();

  const titleValidation = (value) => {
    return /\S+/.test(value) && value.length < 24;
  };
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    setValueHandler: titleSetValueHandler,
    changeHandler: titleChangeHandler,
    blurHandler: titleBlurHandler,
    validateHandler: titleValidateHandler,
  } = useInput(titleValidation);

  const typeValidation = (value) => {
    return mode === 'edit' ? true : value.length > 0;
  };
  const {
    value: typeValue,
    isValid: typeIsValid,
    hasError: typeHasError,
    changeHandler: typeChangeHandler,
    validateHandler: typeValidateHandler,
  } = useInput(typeValidation);

  const valueFieldValidation = (value) => {
    return mode === 'edit' ? true : /^\d+(\.\d{1,2})?$/.test(value);
  };
  const {
    value: valueFieldValue,
    isValid: valueFieldIsValid,
    hasError: valueFieldHasError,
    changeHandler: valueFieldChangeHandler,
    blurHandler: valueFieldBlurHandler,
    validateHandler: valueFieldValidateHandler,
  } = useInput(valueFieldValidation);

  const { loading, error, makeRequest, clearError } = useRequest();

  useEffect(() => {
    if (mode === 'edit') {
      const getRequestCallback = (response) => {
        titleSetValueHandler(response.data.title);
      };

      makeRequest(
        {
          method: 'get',
          url:
            process.env.REACT_APP_BACKEND_URL +
            `/operations/${params.operationId}`,
        },
        getRequestCallback
      );
    }
  }, [mode, params.operationId, makeRequest, titleSetValueHandler]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formIsValid = titleIsValid && typeIsValid && valueFieldIsValid;

    if (!formIsValid) {
      titleValidateHandler();
      typeValidateHandler();
      valueFieldValidateHandler();
      return;
    }

    const otherRequestsCallback = (response) => {
      if (response.status === 200 || response.status === 201) {
        history.push(`/${params.walletId}/operations`);
      }
    };

    if (mode === 'edit') {
      makeRequest(
        {
          method: 'patch',
          url:
            process.env.REACT_APP_BACKEND_URL +
            `/operations/${params.operationId}`,
          data: {
            title: titleValue,
          },
        },
        otherRequestsCallback
      );
    } else {
      makeRequest(
        {
          method: 'post',
          url: process.env.REACT_APP_BACKEND_URL + '/operations',
          data: {
            walletId: params.walletId,
            title: titleValue,
            type: typeValue,
            value: valueFieldValue,
          },
        },
        otherRequestsCallback
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
        name="title"
        label="Title"
        disabled={false}
        errorMessage="Title must be provided and have less than 24 characters"
        type="text"
        value={titleValue}
        changeHandler={titleChangeHandler}
        blurHandler={titleBlurHandler}
        hasError={titleHasError}
      />
      <RadioInputs
        name="type"
        label="Type"
        disabled={mode === 'edit'}
        errorMessage="Please choose one of the available options"
        buttons={['incoming', 'outgoing']}
        labels={['Incoming', 'Outgoing']}
        value={typeValue}
        changeHandler={typeChangeHandler}
        hasError={typeHasError}
      />
      <Input
        name="value"
        label="Value"
        disabled={mode === 'edit'}
        errorMessage="Please provide a valid number"
        type="number"
        value={valueFieldValue}
        changeHandler={valueFieldChangeHandler}
        blurHandler={valueFieldBlurHandler}
        hasError={valueFieldHasError}
      />
      <Button
        type="submit"
        text={mode === 'edit' ? 'Update' : 'Add'}
        wide={true}
        alternative={false}
      />
      <Link to={`/${params.walletId}/operations`} className={classes.link}>
        Cancel
      </Link>
    </>
  );

  return <Form onSubmit={submitHandler}>{content}</Form>;
};

HistoryForm.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default HistoryForm;
