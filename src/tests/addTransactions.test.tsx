import { render, screen } from '@testing-library/react';
import AddTransactions from '../components/addTransactions';

jest.mock('../components/icon', () => () => <div data-testid="icon-mock">Icon Component</div>);
jest.mock('../forms/transactionForm', () => () => <div data-testid="transaction-form-mock">Transaction Form</div>);

describe('AddTransactions Component', () => {
  test('renders the icon component with correct props', () => {
    render(<AddTransactions />);
    const iconElement = screen.getByTestId('icon-mock');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.textContent).toBe('Icon Component');
  });

  test('renders the TransactionForm component', () => {
    render(<AddTransactions />);
    const formElement = screen.getByTestId('transaction-form-mock');
    expect(formElement).toBeInTheDocument();
    expect(formElement.textContent).toBe('Transaction Form');
  });
});
