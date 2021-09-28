import React from 'react';
import PropTypes from 'prop-types';

import classes from './Form.module.scss';

const Form = ({ onSubmit, children }) => {
  return (
    <form className={classes.form} autoComplete="off" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
