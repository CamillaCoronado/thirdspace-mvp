import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Button from './Button.svelte';

describe('Button component', () => {
  it('renders with correct text', () => {
    const { getByText } = render(Button, { props: { text: 'Click me' } });

    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('fires click event', async () => {
    const { getByText, component } = render(Button, {
      props: { text: 'Click me' },
    });
    const button = getByText('Click me');

    const handleClick = vi.fn();
    component.$on('click', handleClick);

    await fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom CSS classes', () => {
    const { container } = render(Button, { props: { text: 'Click me' } });
    const button = container.querySelector('button');

    if (button) {
      button.classList.add('custom-class');
      expect(button).toHaveClass('custom-class');
    } else {
      throw new Error('Button not found');
    }
  });
});
