import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useRootContext() {
  return useContext(RootContext);
}
