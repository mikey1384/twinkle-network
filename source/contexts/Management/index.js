import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ManagementActions from './actions';
import ManagementReducer from './reducer';

export const ManagementContext = createContext();
export const initialManagementState = {
  accountTypes: [],
  accountTypesLoaded: false,
  loaded: false,
  moderators: [],
  moderatorsLoaded: false
};

ManagementContextProvider.propTypes = {
  children: PropTypes.node
};

export function ManagementContextProvider({ children }) {
  const [managementState, managementDispatch] = useReducer(
    ManagementReducer,
    initialManagementState
  );
  return (
    <ManagementContext.Provider
      value={{
        state: managementState,
        actions: ManagementActions(managementDispatch)
      }}
    >
      {children}
    </ManagementContext.Provider>
  );
}
