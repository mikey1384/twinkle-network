import { useContext } from 'react';
import { InputContext } from './InputContext';
import { AppContext } from './AppContext';

export function useInputContext() {
  const { commentInput, homeInput } = useContext(InputContext);
  return { commentInput, homeInput };
}

export function useAppContext() {
  const { content, explore, home, profile, view } = useContext(AppContext);
  return { content, explore, home, profile, view };
}
