import React from 'react';
import PropTypes from 'prop-types';

import classes from './ToggleInput.module.scss';

const ToggleInput = ({
  name,
  label,
  checkboxChecked,
  changeHandler,
  hasError,
}) => {
  let classList = [classes['input-field']];

  if (hasError) {
    classList = [...classList, classes['input-field--invalid']];
  }
  const inputFieldClasses = classList.join(' ');

  return (
    <div className={inputFieldClasses}>
      <div className={classes['toggle-input-label']}>{label}</div>
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checkboxChecked}
        className={classes['toggle-input']}
        onChange={changeHandler}
      />
      <label htmlFor={name} className={classes['toggle-label']}>
        <span className={classes.toggle}></span>
      </label>
    </div>
  );
};

ToggleInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checkboxChecked: PropTypes.bool.isRequired,
  changeHandler: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
};

export default ToggleInput;
