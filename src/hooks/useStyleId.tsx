import { useId } from 'react';

/** Id that is safe to use in react's <style> tag */
export function useStyleId() {
  const id = useId();

  return id.replaceAll(':', '__');
}
