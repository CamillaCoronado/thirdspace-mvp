import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Test from './Test.svelte';
import '@testing-library/jest-dom'

it('correctly calls onMount', () => {
	render(Test);
	expect(screen.getByText('1')).toBeInTheDocument();
});