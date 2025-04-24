import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render the button with the provided children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should apply the default variant class', () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /default button/i });
    // Assuming 'bg-primary' is part of the default variant style
    // We might need to adjust this based on the actual implementation in button.tsx
    expect(buttonElement).toHaveClass('bg-primary');
  });

  it('should apply the specified variant class', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /destructive button/i });
    // Assuming 'bg-destructive' is part of the destructive variant style
    expect(buttonElement).toHaveClass('bg-destructive');
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
  });
});
