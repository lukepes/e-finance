import React from 'react';
import PropTypes from 'prop-types';

import classes from './Input.module.scss';

const Input = ({
  name,
  label,
  disabled,
  errorMessage,
  type,
  value,
  changeHandler,
  blurHandler,
  hasError,
}) => {
  let classList = [classes['input-field']];

  if (hasError) {
    classList = [...classList, classes['input-field--invalid']];
  }
  if (disabled) {
    classList = [...classList, classes['input-field--disabled']];
  }
  const inputFieldClasses = classList.join(' ');

  return (
    <div className={inputFieldClasses}>
      <label htmlFor={name} className={classes.label}>
        {label}{' '}
        {hasError && (
          <span className={classes['error-message']}>{errorMessage}</span>
        )}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        disabled={disabled}
        value={value}
        onChange={changeHandler}
        onBlur={blurHandler}
        className={classes.input}
      />
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  blurHandler: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
};

export default Input;
