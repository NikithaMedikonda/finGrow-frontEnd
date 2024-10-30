import { render, screen } from '@testing-library/react';
import Forms from '../components/forms';

jest.mock('../components/addTransactions', () => () => <div>Add Transactions Component</div>);
jest.mock('../components/budget', () => () => <div>Budget Component</div>);
jest.mock('../components/savings', () => () => <div>Savings Component</div>);
jest.mock('../components/statement', () => () => <div>Statements Component</div>);

describe('Forms Component', () => {
  test('renders the Forms component with all subcomponents', () => {
    render(<Forms />);

    expect(screen.getByText(/Record Expenses/i)).toBeInTheDocument();

    expect(screen.getByText(/Add Transactions Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Savings Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Statements Component/i)).toBeInTheDocument();
  });
});
