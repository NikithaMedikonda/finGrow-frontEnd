import { render, screen } from '@testing-library/react';
import Dashboard from '../Pages/dashboard';
import { UserContext } from '../context/context';
import { MemoryRouter } from 'react-router-dom';

describe('Dashboard Component', () => {
    const mockUser = { username: 'Nikitha' };
  
    const renderComponent = (user: any) => {
        render(
            <UserContext.Provider 
            value={{
                user: user,
                setUser: jest.fn(),
                transactions: [],
                setTransactions: jest.fn(),
                add: false,
                setAdd: jest.fn()
            }}
            >
                <MemoryRouter>
                    <Dashboard />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    test('renders the dashboard header correctly', () => {
        renderComponent(mockUser);
        expect(screen.getByText('Fin')).toBeInTheDocument();
        expect(screen.getByText('Grow')).toBeInTheDocument();
    });

    test('renders the Welcome component when user is present', () => {
        renderComponent(mockUser);
        expect(
            screen.getByText((content, element) =>
                element?.textContent === 'Welcome Nikitha'
            )
        ).toBeInTheDocument();
    });

    test('does not render Welcome content if user is absent', () => {
        renderComponent(null);
        expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
    });

    test('renders the Forms component with heading', () => {
        renderComponent(mockUser);
        expect(screen.getByText('Record Expenses')).toBeInTheDocument();
    });
});
