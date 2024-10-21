import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Report from "../components/report"
import { UserContext } from "../context/context";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();

describe("FinancialReport Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (user:any) => {
        render(
            <UserContext.Provider
                value={{
                    user: user,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: jest.fn(),
                    add: false,
                    setAdd: jest.fn()
                }}
            >
                <MemoryRouter>
                    <Report />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    test("renders 'No User Context' when no user is present", () => {
        renderComponent(null);
        expect(screen.getByText("No User Context")).toBeInTheDocument();
    });

    test("renders report type dropdown and form fields", () => {
        renderComponent(mockSetUser);
        expect(screen.getByText("Select a report")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Generate" })).toBeInTheDocument();
    });

    test("alerts when no report type is selected and 'Generate' is clicked", () => {
        renderComponent(mockSetUser)
        window.alert = jest.fn();
        fireEvent.click(screen.getByRole("button", { name: "Generate" }));
        expect(window.alert).toHaveBeenCalledWith("Please select a report type.");
    });

    test("fetches Income/Expenses report and displays results", async () => {
        renderComponent(mockSetUser);
    
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                totalIncome: 1000,
                totalExpenses: 500,
            }),
        });
    
        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Income & Expenses" },
        });
    
        fireEvent.change(screen.getByTestId("startDate"), {
            target: { value: "2024-10-01" },
        });
    
        fireEvent.change(screen.getByTestId("endDate"), {
            target: { value: "2024-10-21" },
        });
    
        fireEvent.click(screen.getByRole("button", { name: "Generate" }));
    
        await waitFor(() => {
            expect(screen.getByText("Total Income: 1000")).toBeInTheDocument();
            expect(screen.getByText("Total Expenses: 500")).toBeInTheDocument();
            expect(screen.getByText("All Transactions")).toBeInTheDocument();
        });
    });
    
});