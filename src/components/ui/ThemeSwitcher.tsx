import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { toggleTheme } from '../../store/themeSlice';

const ThemeSwitcher: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.value);
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 22,
        color: theme === 'dark' ? '#b48fc2' : '#7c5fd4',
        padding: 6,
        borderRadius: 8,
        transition: 'background 0.2s',
      }}
      title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeSwitcher;
