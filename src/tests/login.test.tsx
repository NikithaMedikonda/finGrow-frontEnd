import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../Pages/login';
import { UserContext } from '../context/context';
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';

global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("LoginPage Component", () => {
    const mockSetUser = jest.fn()

    beforeAll(() => {
        window.alert = jest.fn();  
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const renderComponent = (userContextValue = {}) => {
        render(
            <UserContext.Provider
                value={{
                    user: null,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: jest.fn(),
                    add: false,
                    setAdd: jest.fn(),
                    ...userContextValue,
                }}
            >
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    test("renders 'Context not present' when UserContext is missing", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByText("Context not present")).toBeInTheDocument();
    });

    test("renders username and password inputs and submit button", () => {
        renderComponent();

        expect(screen.getByText("Welcome to FinGrow")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    test("updates username and password state on input change", () => {
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "Nikitha" } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "1234" } });

        expect(screen.getByPlaceholderText(/Username/i)).toHaveValue("Nikitha");
        expect(screen.getByPlaceholderText(/Password/i)).toHaveValue("1234");
    });

    test("shows an alert and navigates to dashboard on successful login", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: "Nikitha" }),
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "Nikitha" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(()=> {
            expect(window.alert).toHaveBeenCalledWith('Login successful!');
            expect(mockSetUser).toHaveBeenCalledWith({username: "Nikitha"})
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        })
    });

    test("displays error alert on server error (500)", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "Nikitha" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error occured while logging in');
        });
    });

    test("shows alert on fetch/network error", async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "Nikitha" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Error occured while fetching user details");
        });
    });

    test("navigates to the registration page when clicking Register", () => {
        renderComponent();

        fireEvent.click(screen.getByText(/Register/i));

        expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
});

