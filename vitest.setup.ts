// Ensure Vitest globals are recognized by TypeScript

import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mocking Next.js modules and utilities
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: {
    src: string | { src: string };
    alt: string;
    width?: number;
    height?: number;
    [key: string]: any;
  }) => {
    const { src, alt, width, height, ...rest } = props;
    return React.createElement('img', {
      src: typeof src === 'string' ? src : src.src,
      alt,
      width,
      height,
      ...rest,
    });
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) => React.createElement('a', { href, ...rest }, children),
}));

// Mocking console.error to suppress error messages in tests
// This is useful for ignoring errors triggered directly via tests
const globalConsoleError = global.console.error;
vi.spyOn(console, 'error').mockImplementation(() => null);
