import { render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "../context/context";
import Transactions from "../components/transactions";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Transactions Component", () => {
    type User = {
        username: string;
        password: string;
        totalIncome: number;
        balance: number;
    };

    const mockUserContext = {
        user: { username: "testuser", password: "password", totalIncome: 10000, balance: 8000 } as User,
        setUser: jest.fn(),
        transactions: [],
        setTransactions: jest.fn(),
        add: false,
        setAdd: jest.fn(),
    };

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    const renderComponent = (context: any) => {
        return render(
            <UserContext.Provider value={context}>
                <Transactions />
            </UserContext.Provider>
        );
    };

    const createMockTransactions = () => [
        {
            id: 1,
            name: "Medicine",
            category: "Emergency fund",
            date: "2024-10-01T00:00:00Z",
            transactionType: "credit",
            amount: 10000,
        },
        {
            id: 2,
            name: "Food",
            category: "Groceries",
            date: "2024-10-05T00:00:00Z",
            transactionType: "debit",
            amount: 2000,
        },
    ];

    test("renders the transactions when data is available", async () => {
        const mockTransactions = createMockTransactions();
        fetchMock.mockResponseOnce(JSON.stringify(mockTransactions));
    
        renderComponent(mockUserContext);
    
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(screen.getByText(/Medicine \| Emergency fund/i)).toBeInTheDocument();
            

            expect(screen.getByText(/1 Oct 2024/i)).toBeInTheDocument();
            expect(screen.getByText(/Rs.10000/i)).toBeInTheDocument();
            
            expect(screen.getByText(/Food \| Groceries/i)).toBeInTheDocument();
            expect(screen.getByText(/5 Oct 2024/i)).toBeInTheDocument();
            expect(screen.getByText(/-Rs.2000/i)).toBeInTheDocument();
        });
    });
    

    test("renders 'No recent Transactions Found' when there are no transactions", async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]));

        renderComponent(mockUserContext);

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(screen.getByText("No recent Transactions Found")).toBeInTheDocument();
    });

    test("renders 'No User' message when there is no user in context", async () => {
        const mockContextWithoutUser = { user: null, setAdd: jest.fn() };

        renderComponent(mockContextWithoutUser);

        expect(screen.getByText("No recent Transactions Found")).toBeInTheDocument();
    });
});