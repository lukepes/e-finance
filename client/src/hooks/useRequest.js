import { useCallback, useReducer } from 'react';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  error: null,
};

const useRequest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const makeRequest = useCallback(async (config, manageResponse) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios(config);
      dispatch({
        type: 'SET_LOADING',
        payload: false,
      });
      manageResponse(response);
    } catch (error) {
      if (error.response) {
        const err = {
          status: error.response.status,
          statusText: error.response.data.message
            ? error.response.data.message
            : error.response.statusText,
        };
        dispatch({ type: 'SET_ERROR', payload: err });
      } else {
        const err = {
          status: 400,
          statusText: 'Unknown error. Please contact the administrator',
        };
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }
  }, []);

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return {
    loading: state.loading,
    error: state.error,
    makeRequest,
    clearError,
  };
};

export default useRequest;
