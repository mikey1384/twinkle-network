import { useContext } from 'react';
import { InputContext } from './InputContext';
import { AppContext } from './AppContext';

export function useInputContext() {
  return useContext(InputContext);
}
export function useAppContext() {
  return useContext(AppContext);
}
