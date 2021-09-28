import { BrowserRouter as Router, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import axios from 'axios';

import WalletForm from './WalletForm';

jest.mock('axios');

describe('Component: WalletForm', () => {
  test('renders empty fields and displays "add wallet" button, if mode passed by props is "add"', () => {
    render(
      <Router>
        <Route>
          <WalletForm mode="add" />
        </Route>
      </Router>
    );

    const nameInput = screen.getByRole('textbox');
    const radioButtons = screen.getAllByRole('radio');
    const balanceInput = screen.getByRole('spinbutton');
    const addButton = screen.getByRole('button');

    expect(nameInput).toHaveValue('');
    radioButtons.forEach((radioButton) => {
      expect(radioButton).toBeEnabled();
      expect(radioButton).not.toBeChecked();
    });
    expect(balanceInput).toHaveValue(null);
    expect(addButton).toHaveTextContent(/add wallet/i);
  });

  test('renders filled or disabled fields and displays "update wallet" button, if mode passed by props is "edit"', async () => {
    const response = {
      data: {
        _id: '1',
        name: 'Wallet',
        allowDebit: false,
      },
    };

    axios.get.mockResolvedValue(response);

    render(
      <Router>
        <Route>
          <WalletForm mode="edit" />
        </Route>
      </Router>
    );

    const nameInput = await screen.findByRole('textbox');
    const radioButtons = await screen.findAllByRole('radio');
    const balanceInput = await screen.findByRole('spinbutton');
    const allowDebitCheckbox = await screen.findByRole('checkbox');
    const editButton = await screen.findByRole('button');

    expect(nameInput).toHaveValue('Wallet');
    radioButtons.forEach((radioButton) => {
      expect(radioButton).toBeDisabled();
      expect(radioButton).not.toBeChecked();
    });
    expect(balanceInput).toBeDisabled();
    expect(allowDebitCheckbox).not.toBeChecked();
    expect(editButton).toHaveTextContent(/update wallet/i);
  });

  test('allowDebit is checked if fetched allowDebit is true and mode passed in props is "edit"', async () => {
    const response = {
      data: {
        _id: '1',
        name: 'Wallet',
        allowDebit: true,
      },
    };

    axios.get.mockResolvedValue(response);

    render(
      <Router>
        <Route>
          <WalletForm mode="edit" />
        </Route>
      </Router>
    );

    const allowDebitCheckbox = await screen.findByRole('checkbox');

    expect(allowDebitCheckbox).toBeChecked();
  });
});
