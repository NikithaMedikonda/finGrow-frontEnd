import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Report from "../components/report"
import { UserContext } from "../context/context";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();

describe("FinancialReport Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (user: any) => {
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

    test("generates income and expenses report", async () => {
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

    test("alerts for budget summary when usage percentage exceeds 90%", async () => {
        renderComponent(mockSetUser);
        window.alert = jest.fn();

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { category: "Food", usagePercentage: "95%" },
                { category: "Transport", usagePercentage: "80%" },
            ],
        });

        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Budget Summary" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Generate" }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                "The categories: Food have exceeded 90% of the budget limit."
            );
        });
    });

    test("alerts for savings progress when progress percentage exceeds 90%", async () => {
        renderComponent(mockSetUser);
        window.alert = jest.fn();

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { savingGoal: "Vacation", progressPercentage: "95%" },
                { savingGoal: "Emergency Fund", progressPercentage: "85%" },
            ],
        });

        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Savings Progress" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Generate" }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                "Congratulations! The savings goals: Vacation have exceeded 90%."
            );
        });
    });

    test("displays error message if the report generation fails", async () => {
        renderComponent({ username: "Nikitha" });
        window.alert = jest.fn();

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Income & Expenses" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Generate" }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                "Error generating report. Please try again."
            );
        });
    });

    test("handles network error gracefully", async () => {
        renderComponent({ username: "Nikitha" });
        window.alert = jest.fn();

        (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Income & Expenses" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate" }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("error fetching report");
        });
    });

    test("handles empty transactions when generating income and expenses report", async () => {
        renderComponent({ username: "Nikitha" });

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                totalIncome: 0,
                totalExpenses: 0,
            }),
        });

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Income & Expenses" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Generate" }));

        await waitFor(() => {
            expect(screen.getByText("Total Income: 0")).toBeInTheDocument();
            expect(screen.getByText("Total Expenses: 0")).toBeInTheDocument();
            expect(screen.getByText("All Transactions")).toBeInTheDocument();
        });
    });

    test("renders individual transactions correctly", async () => {
        const mockTransactions = [
            { id: 1, name: "Milk", category: "Groceries", date: "2024-10-01", transactionType: "debit", amount: 500 },
            { id: 2, name: "Apple", category: "Groceries", date: "2024-10-01", transactionType: "debit", amount: 500, },
        ];

        renderComponent({ username: "Nikitha" });

        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValueOnce({ ok: true, json: async () => mockTransactions });

        fireEvent.change(screen.getByTestId("reportType"), {
            target: { value: "Income & Expenses" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Generate" }));

        const transactionItems = await screen.findAllByTestId("transaction-item");

        expect(transactionItems.length).toBe(mockTransactions.length);
    });

});