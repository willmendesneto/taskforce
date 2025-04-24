import { render, screen } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import { describe, it, expect, vi } from 'vitest';

import { DashboardHeader } from '@/components/dashboard/header';

// Mock next-auth signOut function
vi.mock('next-auth/react', async () => {
  const actual = await vi.importActual('next-auth/react');
  return {
    ...actual,
    signOut: vi.fn(),
  };
});

describe('DashboardHeader Component', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    image: null,
  };

  it('renders app name', () => {
    render(<DashboardHeader user={mockUser} />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });
});
