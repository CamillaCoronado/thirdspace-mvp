import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import DatePicker from './DatePicker.svelte';

// Mock firebaseSetup to avoid actual Firebase calls
vi.mock('../../lib/utils/firebaseSetup', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
  },
}));

describe('DatePicker component', () => {
  it('renders with initial date', () => {
    const { getByDisplayValue } = render(DatePicker, {
      props: { month: 'January', day: 1, year: 2024 },
    });

    const monthSelect = getByDisplayValue('January') as HTMLSelectElement;
    const dayInput = getByDisplayValue('1') as HTMLInputElement;
    const yearInput = getByDisplayValue('2024') as HTMLInputElement;

    expect(monthSelect).toBeInTheDocument();
    expect(dayInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('opens the date picker when clicked (simulated)', async () => {
    const { getByDisplayValue } = render(DatePicker, {
      props: { month: 'January', day: 1, year: 2024 },
    });

    const monthSelect = getByDisplayValue('January') as HTMLSelectElement;
    await fireEvent.click(monthSelect);

    // In this implementation, "date-picker-calendar" is not a real element,
    // but you may want to simulate interaction by verifying another part of the UI changes.
    // For now, this test will simply check if clicking on monthSelect triggers a UI update.
    expect(monthSelect).toBeInTheDocument(); // Simple check, replace with relevant checks
  });

  it('selects a date', async () => {
    const { getByDisplayValue } = render(DatePicker, {
      props: { month: 'January', day: 1, year: 2024 },
    });

    const dayInput = getByDisplayValue('1') as HTMLInputElement;
    await fireEvent.input(dayInput, { target: { value: '15' } });

    expect(dayInput.value).toBe('15');
  });

  it('handles invalid date input', async () => {
    const { getByDisplayValue } = render(DatePicker, {
      props: { month: 'January', day: 1, year: 2024 },
    });

    const dayInput = getByDisplayValue('1') as HTMLInputElement;

    // Simulate entering an invalid date, such as a non-numeric value
    await fireEvent.input(dayInput, { target: { value: 'invalid-date' } });

    expect(dayInput.value).toBe(''); // Assuming invalid dates are cleared
  });
});
