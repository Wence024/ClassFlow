import { useComponents as useComponentsContext } from '../contexts/components/ComponentsProvider';

export function useComponents() {
  return useComponentsContext();
}
