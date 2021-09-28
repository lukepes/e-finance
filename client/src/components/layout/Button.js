import React from 'react';
import PropTypes from 'prop-types';

import classes from './Button.module.scss';

const Button = ({ type, text, wide, alternative, clickHandler }) => {
  let classList = [classes.button];

  if (wide) {
    classList = [...classList, classes['button--wide']];
  }
  if (alternative) {
    classList = [...classList, classes['button--alt']];
  }

  const classNames = classList.join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={type === 'button' ? clickHandler : undefined}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  wide: PropTypes.bool.isRequired,
  alternative: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
};

export default Button;
