import { render, screen } from '@testing-library/react';

import Input from './Input';

describe('Component: Input', () => {
  test('shows error message if hasError prop is true', () => {
    render(
      <Input
        name="input"
        label="label"
        disabled={false}
        errorMessage="Please provide a value"
        type="text"
        value="value"
        changeHandler={() => {}}
        blurHandler={() => {}}
        hasError={true}
      />
    );

    const message = screen.getByText('Please provide a value');
    expect(message).toBeInTheDocument();
  });

  test('does not show error message if hasError prop is false', () => {
    render(
      <Input
        name="input"
        label="label"
        disabled={false}
        errorMessage="Please provide a value"
        type="text"
        value="value"
        changeHandler={() => {}}
        blurHandler={() => {}}
        hasError={false}
      />
    );

    const input = screen.queryByText('Please provide a value');
    expect(input).not.toBeInTheDocument();
  });
});
