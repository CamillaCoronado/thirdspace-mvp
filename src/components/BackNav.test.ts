import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import BackNav from './BackNav.svelte';

describe('BackNav component', () => {
  it('renders the button with the correct image', () => {
    const { getByAltText } = render(BackNav, { pageName: 'home' });

    //check if the button with the image is in the document
    const buttonImage = getByAltText('back-nav');
    expect(buttonImage).toBeInTheDocument();
  });

  it('renders BackNav with different page names', () => {
    const { getByAltText, rerender } = render(BackNav, {
      props: { pageName: 'home' },
    });

    let image = getByAltText('back-nav');
    expect(image).toBeInTheDocument();
    rerender({ pageName: 'settings' });
    image = getByAltText('back-nav');
    expect(image).toBeInTheDocument();
  });
});
