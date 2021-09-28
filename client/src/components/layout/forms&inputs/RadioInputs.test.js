import { render, screen } from '@testing-library/react';

import RadioInputs from './RadioInputs';

describe('Component: RadioInputs', () => {
  test('shows error message if hasError prop is true', () => {
    render(
      <RadioInputs
        name="radio-input"
        label="label"
        disabled={false}
        errorMessage="Please choose an option"
        buttons={['pln', 'usd', 'eur']}
        value="pln"
        changeHandler={() => {}}
        hasError={true}
      />
    );

    const message = screen.getByText('Please choose an option');
    expect(message).toBeInTheDocument();
  });

  test('does not show error message if hasError prop is false', () => {
    render(
      <RadioInputs
        name="radio-input"
        label="label"
        disabled={false}
        errorMessage="Please choose an option"
        buttons={['pln', 'usd', 'eur']}
        value="pln"
        changeHandler={() => {}}
        hasError={false}
      />
    );

    const message = screen.queryByText('Please choose an option');
    expect(message).not.toBeInTheDocument();
  });

  test('correct input option is checked', () => {
    const passedValue = 'pln';
    render(
      <RadioInputs
        name="radio-input"
        label="label"
        disabled={false}
        errorMessage="Please choose an option"
        buttons={['pln', 'usd', 'eur']}
        value={passedValue}
        changeHandler={() => {}}
        hasError={false}
      />
    );

    const radioButtons = screen.getAllByRole('radio');

    radioButtons.forEach((radioButton) => {
      if (passedValue === radioButton.value) {
        expect(radioButton).toBeChecked();
      } else {
        expect(radioButton).not.toBeChecked();
      }
    });
  });
});
