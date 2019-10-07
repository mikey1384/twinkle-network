import { useContext } from 'react';
import { AppContext } from './AppContext';
import { ExploreContext } from './Explore';
import { ContentContext } from './Content';
import { HomeContext } from './Home';
import { InputContext } from './Input';
import { ViewContext } from './View';

export function useExploreContext() {
  return useContext(ExploreContext);
}
export function useHomeContext() {
  return useContext(HomeContext);
}
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
