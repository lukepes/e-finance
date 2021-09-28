import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import axios from 'axios';

import Wallets from './Wallets';

jest.mock('axios');

describe('Component: Wallets', () => {
  test('displays a message about no wallets, if there are no wallets, renders link to wallet form', async () => {
    const response = {
      data: [],
    };

    axios.get.mockResolvedValue(response);

    render(
      <Router>
        <Wallets />
      </Router>
    );

    const heading = await screen.findByRole('heading', {
      text: /You do not have any wallet yet/i,
    });

    const message = await screen.findByText(
      /Add a wallet to start managing your finances more consciously/i
    );

    const addWalletButton = await screen.findByRole('link', {
      text: /add a wallet/i,
    });

    expect(heading).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(addWalletButton).toBeInTheDocument();
  });

  test('displays wallet list received from the server', async () => {
    const response = {
      data: [
        {
          _id: '1',
          name: 'Wallet 1',
          currency: 'pln',
          balance: 128.16,
          allowDebit: false,
        },
        {
          _id: '2',
          name: 'Wallet 2',
          currency: 'usd',
          balance: 256.32,
          allowDebit: true,
        },
        {
          _id: '3',
          name: 'Wallet 3',
          currency: 'eur',
          balance: 512.64,
          allowDebit: false,
        },
      ],
    };

    axios.get.mockResolvedValue(response);

    render(
      <Router>
        <Wallets />
      </Router>
    );

    const walletList = await screen.findAllByTestId('wallet');
    expect(walletList).toHaveLength(3);
  });
});
