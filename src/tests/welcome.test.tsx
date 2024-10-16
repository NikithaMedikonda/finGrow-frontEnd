import { render, screen } from '@testing-library/react';
import Welcome from '../components/welcome';
import { UserContext } from '../context/context';

describe('Welcome Component', () => {
    const mockUser = { username: 'Nikitha' };

    const renderComponent = (user: any) => {
        render(
            <UserContext.Provider 
            value={{
                user,
                setUser: jest.fn(),
                transactions: [],
                setTransactions: jest.fn(),
                add: false,
                setAdd: jest.fn()
            }}>
                <Welcome />
            </UserContext.Provider>
        );
    };

    test('renders the welcome message if user is present', () => {
        renderComponent(mockUser);
        expect(
            screen.getByText((content, element) =>
                element?.textContent === 'Welcome Nikitha'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Finance Management System/i)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', './assets/image.jpg');
    });

    test('renders empty content if user is not present', () => {
        renderComponent(null);
        expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
    });

    test('renders fallback message if context is not available', () => {
        render(<Welcome />);
        expect(screen.getByText(/Context not present/i)).toBeInTheDocument();
    });
});
