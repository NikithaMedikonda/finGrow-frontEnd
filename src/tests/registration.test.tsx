import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationPage from '../Pages/registration';
import { UserContext } from '../context/context';
import { MemoryRouter } from 'react-router-dom';
import { API } from '../api';

global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('RegistrationPage Component', () => {
    const mockSetUser = jest.fn();

    beforeAll(() => {
        window.alert = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
        renderComponent();
    });

    const renderComponent = () => {
        render(
            <UserContext.Provider
                value={{
                    user: null,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: jest.fn(),
                    add: false,
                    setAdd: jest.fn(),
                }}
            >
                <MemoryRouter>
                    <RegistrationPage />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    test('renders input fields and submit button', () => {
        expect(screen.getByText('Welcome to FinGrow')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Income/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('updates input values on change', () => {
        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: 'testUser' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'testPassword' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Income/i), {
            target: { value: '10000' },
        });

        expect(screen.getByPlaceholderText(/Username/i)).toHaveValue('testUser');
        expect(screen.getByPlaceholderText(/Password/i)).toHaveValue('testPassword');
        expect(screen.getByPlaceholderText(/Enter Income/i)).toHaveValue(10000);
    });

    test('shows success alert and navigates to dashboard on successful registration', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: 'testUser' }),
        });

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: 'testUser' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'testPassword' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Income/i), {
            target: { value: '10000' },
        });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('User created succesfully');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('navigates to the login page when clicking Login', () => {
        fireEvent.click(screen.getByText(/Login/i));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
