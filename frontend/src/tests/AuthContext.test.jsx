import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as api from '../api/api';

jest.mock('../api/api');

function TestConsumer() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'in' : 'out'}</span>
      <span data-testid="user-name">{user ? user.name : 'none'}</span>
      <button onClick={() => login('a@b.com', 'pass123')}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('starts unauthenticated when no saved session exists', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe('out');
  });

  it('logs in and stores the session', async () => {
    api.login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, name: 'Saim' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('login').click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('in');
    expect(screen.getByTestId('user-name').textContent).toBe('Saim');
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('logs out and clears the session', async () => {
    api.login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, name: 'Saim' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('login').click();
    });
    await act(async () => {
      screen.getByText('logout').click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('out');
    expect(localStorage.getItem('token')).toBeNull();
  });
});