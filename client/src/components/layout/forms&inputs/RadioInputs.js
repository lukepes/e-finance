import React from 'react';
import PropTypes from 'prop-types';

import classes from './RadioInputs.module.scss';

const RadioInputs = ({
  name,
  label,
  disabled,
  errorMessage,
  buttons,
  labels,
  value,
  changeHandler,
  hasError,
}) => {
  const radioInputClasses = `${classes['input-field']} ${
    hasError && classes['input-field--invalid']
  } ${disabled && classes['input-field--disabled']}`;

  const displayedButtons = buttons.map((button, index) => {
    return (
      <div className={classes['radio-button']} key={button}>
        <input
          type="radio"
          name={name}
          disabled={disabled}
          id={button}
          value={button}
          checked={value === button}
          onChange={changeHandler}
        />
        <label htmlFor={button} className={classes['radio-label']}>
          <span className={classes.radio}>{labels[index]}</span>
        </label>
      </div>
    );
  });

  return (
    <div className={radioInputClasses}>
      <div className={classes['radio-group-label']}>
        {label}{' '}
        {hasError && (
          <span className={classes['error-message']}>{errorMessage}</span>
        )}
      </div>
      <div className={classes['radio-group']}>{displayedButtons}</div>
    </div>
  );
};

RadioInputs.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
};

export default RadioInputs;
