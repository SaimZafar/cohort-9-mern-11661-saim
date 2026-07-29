import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the email and password fields', () => {
    useAuth.mockReturnValue({ login: jest.fn() });
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('calls login and navigates to dashboard on success', async () => {
    const mockLogin = jest.fn().mockResolvedValue();
    useAuth.mockReturnValue({ login: mockLogin });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'pass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'pass123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error message when login fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    useAuth.mockReturnValue({ login: mockLogin });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});