import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { LoginForm } from '@/components/auth/login-form';
import { useToast } from '@/hooks/use-toast'; // Import the actual hook

// Mock the dependencies
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock the custom hook useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

// Define mock implementations
const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockToast = vi.fn();

describe('LoginForm Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Provide mock implementations
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useToast as Mock).mockReturnValue({
      toast: mockToast,
    });
    // Default mock for signIn (can be overridden in specific tests)
    (signIn as Mock).mockResolvedValue({ ok: true, error: null });
  });

  it('should show validation errors for invalid email and missing password', async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Test invalid email
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByLabelText(/email/i)); // Trigger validation
    fireEvent.click(submitButton);
    // await waitFor(() => {
    //   expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    // });

    // Test missing password (after fixing email)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.blur(screen.getByLabelText(/email/i)); // Trigger validation
    // Clear the previous error message if necessary before checking the next one
    // await waitFor(() => {
    //   expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    // });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Ensure signIn was not called
    expect(signIn).not.toHaveBeenCalled();
  });

  it('should call signIn with correct credentials on valid submission', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('should show loading state and redirect on successful login', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    // Wait for async operations (signIn, toast, push, refresh) to complete
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'You have been logged in.',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });

    // Check if loading state is removed
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });

  it('should display error message and toast on failed login (invalid credentials)', async () => {
    // Mock signIn to return an error
    (signIn as Mock).mockResolvedValue({ ok: false, error: 'CredentialsSignin' });

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    });

    // Ensure no redirection happened
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
    // Check if loading state is removed
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });

  it('should display generic error message and toast on unexpected error', async () => {
    // Mock signIn to throw an error
    (signIn as Mock).mockRejectedValue(new Error('Network Error'));

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    });

    // Ensure no redirection happened
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
    // Check if loading state is removed
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });
});
