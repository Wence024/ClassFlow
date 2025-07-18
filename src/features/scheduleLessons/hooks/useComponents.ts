import { useContext } from 'react';
import { ComponentsContext } from '../contexts/components/ComponentsContext';

export const useComponents = () => {
  const ctx = useContext(ComponentsContext);
  if (!ctx) throw new Error('useComponents must be used within a ComponentsProvider');
  return ctx;
};
