import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPen } from '@fortawesome/free-solid-svg-icons';

import classes from './OneDayOperations.module.scss';

const OneDayOperations = ({
  walletId,
  date,
  operationsList,
  currency,
  onDelete,
}) => {
  let transformedDate = new Date(date);
  transformedDate = `${transformedDate.getDate()}.${
    transformedDate.getMonth() + 1
  }.${transformedDate.getFullYear()}`;

  const displayedOperations = operationsList.map((operation) => {
    let formattedValue;

    if (currency === 'pln') {
      formattedValue = `${operation.value.toFixed(2)} PLN`;
    } else {
      formattedValue =
        currency === 'usd'
          ? `$${operation.value.toFixed(2)}`
          : `€${operation.value.toFixed(2)}`;
    }

    formattedValue =
      operation.type === 'outgoing' ? `-${formattedValue}` : formattedValue;

    const deleteItemHandler = () => {
      onDelete(operation._id);
    };

    return (
      <li key={operation._id} className={classes['operation-item']}>
        <span>{operation.title}</span>
        <span>{formattedValue}</span>
        <span className={classes.actions}>
          <Link to={`/${walletId}/operations/edit/${operation._id}`}>
            <FontAwesomeIcon icon={faPen} />
          </Link>
          <button
            className={classes['action-button']}
            onClick={deleteItemHandler}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </span>
      </li>
    );
  });

  return (
    <>
      <h4 className={classes.date}>{transformedDate}</h4>
      <ul>{displayedOperations}</ul>
    </>
  );
};

OneDayOperations.propTypes = {
  walletId: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  operationsList: PropTypes.array.isRequired,
  currency: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OneDayOperations;
