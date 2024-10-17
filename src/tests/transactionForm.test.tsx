import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserContext } from '../context/context';
import TransactionForm from '../forms/transactionForm';
import { API } from '../api';

const mockSetAdd = jest.fn();
const mockUser = { username: 'Nikitha' };

describe('TransactionForm Component', () => {
    const renderComponent = (user: any) => {
        return render(
            <UserContext.Provider
                value={{
                    user,
                    setUser: jest.fn(),
                    transactions: [],
                    setTransactions: jest.fn(),
                    add: false,
                    setAdd: mockSetAdd,
                }}
            >
                <TransactionForm />
            </UserContext.Provider>
        );
    };

    beforeAll(() => {
        window.alert = jest.fn();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders all input fields', () => {
        renderComponent(mockUser);

        expect(screen.getByPlaceholderText(/transaction name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/type/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/date/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    test('handles form submission successfully', async () => {
        renderComponent(mockUser);

        fireEvent.change(screen.getByPlaceholderText(/transaction name/i), { target: { value: 'Icecream' } });
        fireEvent.change(screen.getByPlaceholderText(/amount/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/type/i), { target: { value: 'debit' } });
        fireEvent.change(screen.getByPlaceholderText(/category/i), { target: { value: 'Groceries' } });
        fireEvent.change(screen.getByPlaceholderText(/date/i), { target: { value: '2024-10-17' } });

        global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${API}/transaction/Nikitha`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Icecream',
                        transactionType: 'debit',
                        amount: '200',
                        date: '2024-10-17',
                        category: 'Groceries',
                    }),
                }
            );
            expect(mockSetAdd).toHaveBeenCalledWith(true);
        });

        expect(window.alert).toHaveBeenCalledWith('Transaction created');
        expect(screen.getByPlaceholderText(/transaction name/i)).toHaveValue('');
        expect(screen.getByPlaceholderText(/amount/i)).toHaveValue('');
    });

    test('shows an alert when fields are empty', () => {
        renderComponent(mockUser);
        global.alert = jest.fn();

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        expect(window.alert).toHaveBeenCalledWith('Please fill all fields.');
    });

    test('displays error alert on failed request', async () => {
        renderComponent(mockUser);

        fireEvent.change(screen.getByPlaceholderText(/transaction name/i), { target: { value: 'Icecream' } });
        fireEvent.change(screen.getByPlaceholderText(/amount/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/type/i), { target: { value: 'debit' } });
        fireEvent.change(screen.getByPlaceholderText(/category/i), { target: { value: 'Groceries' } });
        fireEvent.change(screen.getByPlaceholderText(/date/i), { target: { value: '2024-10-17' } });

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Error occurred' }),
        });

        global.alert = jest.fn();

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Something went wrong');
        });
    });

    test('renders "NO user" when no user is present in context', () => {
        renderComponent(null);

        expect(screen.getByText(/no user/i)).toBeInTheDocument();
    });

    test('renders "Context not present" when UserContext is unavailable', () => {
        render(<TransactionForm />);

        expect(screen.getByText(/context not present/i)).toBeInTheDocument();
    });
});
