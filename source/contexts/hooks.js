import { useContext } from 'react';
import { AppContext } from './AppContext';
import { InputContext } from './InputContext';
import { ViewContext } from './ViewContext';
import { ContentContext } from './ContentContext';

export function useInputContext() {
  return useContext(InputContext);
}
export function useAppContext() {
  return useContext(AppContext);
}
export function useContentContext() {
  return useContext(ContentContext);
}
export function useViewContext() {
  return useContext(ViewContext);
}
