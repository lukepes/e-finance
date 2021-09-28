import { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        value: action.payload,
      };
    case 'CHANGE':
      return {
        ...state,
        value: action.payload,
      };
    case 'BLUR':
      return {
        ...state,
        wasTouched: true,
      };
    case 'TOGGLE_CHECKBOX':
      return {
        ...state,
        checkboxChecked: !state.checkboxChecked,
        wasTouched: true,
      };
    case 'SET_CHECKBOX':
      return {
        ...state,
        checkboxChecked: action.payload,
      };
    case 'VALIDATE':
      return {
        ...state,
        wasTouched: true,
      };
    default:
      return state;
  }
};

const initialState = {
  value: '',
  checkboxChecked: false,
  wasTouched: false,
};

const useInput = (validationFunction, inputIsCheckbox = false) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const valueIsValid = !inputIsCheckbox
    ? validationFunction(state.value)
    : validationFunction(state.checkboxChecked);
  const hasError = !valueIsValid && state.wasTouched;

  const setValueHandler = useCallback((newValue) => {
    dispatch({ type: 'CHANGE', payload: newValue });
  }, []);

  const changeHandler = (e) => {
    dispatch({ type: 'CHANGE', payload: e.target.value });
  };

  const blurHandler = () => {
    dispatch({ type: 'BLUR' });
  };

  const checkboxChangeHandler = () => {
    dispatch({ type: 'TOGGLE_CHECKBOX' });
  };

  const checkboxSetHandler = useCallback((value) => {
    dispatch({ type: 'SET_CHECKBOX', payload: value });
  }, []);

  const validateHandler = () => {
    dispatch({ type: 'VALIDATE' });
  };

  return {
    value: state.value,
    isValid: valueIsValid,
    wasTouched: state.wasTouched,
    hasError: hasError,
    setValueHandler,
    changeHandler,
    blurHandler,
    checkboxChecked: state.checkboxChecked,
    checkboxChangeHandler,
    checkboxSetHandler,
    validateHandler,
  };
};

useInput.propTypes = {
  validationFunction: PropTypes.func.isRequired,
};

export default useInput;
