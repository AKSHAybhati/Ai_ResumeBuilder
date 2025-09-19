import { useUniversalSave } from '../hooks/useUniversalSave';

/**
 * Universal Save Provider - Essential component for automatic database saving
 * This ensures all templates can save to database without individual modifications
 */
export const UniversalSaveProvider = ({ children }) => {
  // Initialize universal save functionality using the custom hook
  useUniversalSave();

  return children;
};