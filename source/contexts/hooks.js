import { useContext } from 'react';
import { AppContext } from './AppContext';
import { InputContext } from './InputContext';
import { ViewContext } from './ViewContext';
import { ScrollContext } from './ScrollContext';

export function useInputContext() {
  return useContext(InputContext);
}
export function useAppContext() {
  return useContext(AppContext);
}
export function useScrollContext() {
  return useContext(ScrollContext);
}
export function useViewContext() {
  return useContext(ViewContext);
}
