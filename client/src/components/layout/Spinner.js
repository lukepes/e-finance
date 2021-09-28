import React from 'react';

import classes from './Spinner.module.scss';

const Spinner = () => {
  return (
    <div className={classes.backdrop}>
      <div className={classes.spinner}></div>
    </div>
  );
};

export default Spinner;
