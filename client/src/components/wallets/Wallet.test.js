import { render, screen } from '@testing-library/react';

import Wallet from './Wallet';

describe('Component: Wallet', () => {
  test('does not show buttons if wallet is not active', () => {
    render(
      <Wallet
        id="1"
        name="wallet"
        currency="pln"
        balance="123"
        activeWalletId="2"
        onActivateWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    );

    const buttons = screen.queryAllByRole('button');

    expect(buttons).toHaveLength(0);
  });

  test('shows buttons if wallet is active', () => {
    render(
      <Wallet
        id="1"
        name="wallet"
        currency="pln"
        balance="123"
        activeWalletId="1"
        onActivateWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    );

    const buttons = screen.queryAllByRole('button');

    expect(buttons).toHaveLength(3);
  });

  test('shows balance in PLN with currency symbol correctly', () => {
    render(
      <Wallet
        id="1"
        name="wallet"
        currency="pln"
        balance="123.45"
        activeWalletId="2"
        onActivateWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    );

    const balance = screen.getByTestId('balance');

    expect(balance).toHaveTextContent(/^\d+(\.\d{1,2})? PLN$/);
  });

  test('shows balance in $ with currency symbol correctly', () => {
    render(
      <Wallet
        id="1"
        name="wallet"
        currency="usd"
        balance="123.45"
        activeWalletId="2"
        onActivateWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    );

    const balance = screen.getByTestId('balance');

    expect(balance).toHaveTextContent(/^\$\d+(\.\d{1,2})?$/);
  });

  test('shows balance in € with currency symbol correctly', () => {
    render(
      <Wallet
        id="1"
        name="wallet"
        currency="eur"
        balance="123.45"
        activeWalletId="2"
        onActivateWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    );

    const balance = screen.getByTestId('balance');

    expect(balance).toHaveTextContent(/^€\d+(\.\d{1,2})?$/);
  });
});
