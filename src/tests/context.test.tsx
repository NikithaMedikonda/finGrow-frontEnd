import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProvider, UserContext } from "../context/context"

const mockUser = {
    username: 'Nikitha',
    password: '1234',
    totalIncome: 25000,
    balance: 25000,
};

const Component = () => {
    const context = React.useContext(UserContext);

    if (!context) return <div>Context not available</div>;

    const { user, setUser, transactions, setTransactions, add, setAdd } = context;

    return (
        <div>
            <p data-testid="user-info">
                {user ? `User: ${user.username}, Balance: ${user.balance}` : 'No User'}
            </p>
            <p data-testid="transactions-count">
                Transactions: {transactions.length}
            </p>
            <p data-testid="add-status">Add: {add ? 'true' : 'false'}</p>
            <button onClick={() => setUser(mockUser)} data-testid="set-user">
                Set User
            </button>
            <button onClick={() => setTransactions([{
                name: 'Icecream',
                transactionType: 'debit',
                amount: '200',
                date: '2024-10-17',
                category: 'Groceries',
            }])} 
            data-testid="add-transaction">
                Add Transaction
            </button>
            <button onClick={() => setAdd(!add)} data-testid="toggle-add">
                Add
            </button>
        </div>
    );
};

describe('UserContext', () => {
    it('should provide initial context values correctly', () => {
        render(
            <UserProvider>
                <Component />
            </UserProvider>
        );

        expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('Transactions: 0');
        expect(screen.getByTestId('add-status')).toHaveTextContent('Add: false');
    });

    it('should update user correctly', () => {
        render(
            <UserProvider>
                <Component />
            </UserProvider>
        );

        fireEvent.click(screen.getByTestId('set-user'));

        expect(screen.getByTestId('user-info')).toHaveTextContent('User: Nikitha, Balance: 25000');
    });

    it('should update transactions correctly', () => {
        render(
            <UserProvider>
                <Component />
            </UserProvider>
        );

        fireEvent.click(screen.getByTestId('add-transaction'));

        expect(screen.getByTestId('transactions-count')).toHaveTextContent('Transactions: 1');
    });

    it('should toggle the "add" state correctly', () => {
        render(
            <UserProvider>
                <Component />
            </UserProvider>
        );

        const status = screen.getByTestId('add-status');
        const toggleButton = screen.getByTestId('toggle-add');

        expect(status).toHaveTextContent('Add: false');

        fireEvent.click(toggleButton);
        expect(status).toHaveTextContent('Add: true');

        fireEvent.click(toggleButton);
        expect(status).toHaveTextContent('Add: false');
    });
});
