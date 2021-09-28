import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import useInput from '../../hooks/useInput';
import useRequest from '../../hooks/useRequest';

import AuthContext from '../../context/auth-context';

import Form from '../layout/forms&inputs/Form';
import Input from '../layout/forms&inputs/Input';
import ToggleInput from '../layout/forms&inputs/ToggleInput';
import Button from '../layout/Button';
import Spinner from '../layout/Spinner';
import Modal from '../layout/Modal';

import classes from './AuthForm.module.scss';

const AuthForm = ({ mode }) => {
  const { login } = useContext(AuthContext);

  const history = useHistory();

  const { loading, error, makeRequest, clearError } = useRequest();

  useEffect(() => {
    if (mode === 'login') {
      const token = localStorage.getItem('token');
      if (token) {
        login(token, true);
        history.replace('/wallets');
      }
    }
  }, [mode, login, history]);

  const emailValidation = (value) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      value
    );
  };
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    validateHandler: emailValidateHandler,
  } = useInput(emailValidation);

  const passwordValidation = (value) => {
    return value.length >= 6;
  };
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    validateHandler: passwordValidateHandler,
  } = useInput(passwordValidation);

  const confirmPasswordValidation = (value) => {
    if (mode === 'register') {
      return value === passwordValue && value.length > 0;
    } else {
      return true;
    }
  };
  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    changeHandler: confirmPasswordChangeHandler,
    blurHandler: confirmPasswordBlurHandler,
    validateHandler: confirmPasswordValidateHandler,
  } = useInput(confirmPasswordValidation);

  const rememberMeValidation = (value) => {
    return true;
  };
  const {
    checkboxChecked: rememberMeChecked,
    checkboxChangeHandler: rememberMeChangeHandler,
    hasError: rememberMeHasError,
  } = useInput(rememberMeValidation);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formIsValid =
      emailIsValid && passwordIsValid && confirmPasswordIsValid;

    if (!formIsValid) {
      emailValidateHandler();
      passwordValidateHandler();
      confirmPasswordValidateHandler();
      return;
    }

    const loginRequestCallback = (response) => {
      login(response.data.token, rememberMeChecked);
      history.push('/wallets');
    };

    if (mode === 'login') {
      makeRequest(
        {
          method: 'post',
          url: process.env.REACT_APP_BACKEND_URL + '/users/login',
          data: {
            email: emailValue,
            password: passwordValue,
          },
        },
        loginRequestCallback
      );
    } else {
      makeRequest(
        {
          method: 'post',
          url: process.env.REACT_APP_BACKEND_URL + '/users/register',
          data: {
            email: emailValue,
            password: passwordValue,
          },
        },
        loginRequestCallback
      );
    }
  };

  const content = loading ? (
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
        name="email"
        label="Email"
        disabled={false}
        errorMessage="Please provide a valid email"
        type="email"
        value={emailValue}
        changeHandler={emailChangeHandler}
        blurHandler={emailBlurHandler}
        hasError={emailHasError}
      />
      <Input
        name="password"
        label="Password"
        disabled={false}
        errorMessage="Password must be at least 6 characters long"
        type="password"
        value={passwordValue}
        changeHandler={passwordChangeHandler}
        blurHandler={passwordBlurHandler}
        hasError={passwordHasError}
      />
      {mode === 'register' && (
        <Input
          name="confirmPassword"
          label="Confirm Password"
          disabled={false}
          errorMessage="Passwords must match"
          type="password"
          value={confirmPasswordValue}
          changeHandler={confirmPasswordChangeHandler}
          blurHandler={confirmPasswordBlurHandler}
          hasError={confirmPasswordHasError}
        />
      )}
      <ToggleInput
        name="remember"
        label="Remember me"
        checkboxChecked={rememberMeChecked}
        changeHandler={rememberMeChangeHandler}
        hasError={rememberMeHasError}
      />

      <Button
        type="submit"
        text={mode === 'register' ? 'Register' : 'Login'}
        wide={true}
        alternative={false}
      />
      {mode === 'login' ? (
        <Link to="/register" className={classes.link}>
          No account yet? Register Here
        </Link>
      ) : (
        <Link to="/login" className={classes.link}>
          Already have an account? Login here
        </Link>
      )}
    </>
  );

  return <Form onSubmit={submitHandler}>{content}</Form>;
};

AuthForm.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default AuthForm;
