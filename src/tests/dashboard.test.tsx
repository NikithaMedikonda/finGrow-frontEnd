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
                    user,
                    setUser: jest.fn(),
                    transactions: [],
                    setTransactions: jest.fn(),
                    add: false,
                    setAdd: jest.fn()
                }}>
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
});
