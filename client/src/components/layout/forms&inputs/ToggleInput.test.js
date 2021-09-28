import { render, screen } from '@testing-library/react';

import ToggleInput from './ToggleInput';

describe('Component: ToggleInput', () => {
  test('is checked when checkboxChecked prop passed is true', () => {
    const allowDebit = true;
    render(
      <ToggleInput
        name="debit"
        label="Allow Debit"
        checkboxChecked={allowDebit}
        changeHandler={() => {}}
      />
    );

    const checkboxInput = screen.getByRole('checkbox');
    expect(checkboxInput).toBeChecked();
  });

  test('is not checked when checkboxChecked prop passed is false', () => {
    const allowDebit = false;
    render(
      <ToggleInput
        name="debit"
        label="Allow Debit"
        checkboxChecked={allowDebit}
        changeHandler={() => {}}
      />
    );

    const checkboxInput = screen.getByRole('checkbox');
    expect(checkboxInput).not.toBeChecked();
  });
});
