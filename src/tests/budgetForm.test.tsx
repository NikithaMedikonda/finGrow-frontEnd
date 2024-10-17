import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BudgetForm from "../forms/budgetForm";
import { UserContext } from "../context/context";
import { MemoryRouter } from "react-router-dom";
import { API } from "../api";

global.fetch = jest.fn();

describe("Checking Budget Form Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (type:string,user:any) => {
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
                    <BudgetForm type={type} />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
    });

    test("should render form inputs and button", () => {
        const user = {name:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        expect(screen.queryByPlaceholderText("Category")).toBeInTheDocument();
        expect(screen.queryByPlaceholderText("Amount")).toBeInTheDocument();
    });

    test("should show 'Context not present' if no context is available", () => {
        render(<BudgetForm type="budget"/>)
        expect(screen.getByText("Context not present")).toBeInTheDocument();
    });

    test("should add a budget", async() => {
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
            ok:true,
            json: async () => ({ category:"Food", limit:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/budget/Nikitha`, {
                method: "POST",
                body: JSON.stringify({category:"Food", limit:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('budget created successfully!');
        });
    })

    test("Should not create budget due to incomplete form",async()=>{
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
            ok:false,
            json: async () => ({ category:"Entertainment", limit:""} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/budget/Nikitha`, {
                method: "POST",
                body: JSON.stringify({category:"Entertainment", limit:""}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Please fill all fields.');
        });
    })

    test("Should not create budget as server error",async()=>{ 
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
           ok:false,
            json: async () => ({ category:"Entertainment", limit:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/budget/Nikitha`, {
                method: "POST",
                body: JSON.stringify({category:"Entertainment", limit:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error occured');
        });
    })
})

describe("Checking Savings Form Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (type:string,user:any) => {
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
                    <BudgetForm type={type} />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
    });

    test("Should create saving",async()=>{
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("savings",user);
        (fetch as jest.Mock).mockResolvedValue({
            ok:true,
            json: async () => ({ title:"Entertainment",targetAmount:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/savings/Nikitha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", targetAmount:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('savings created successfully!');
        });
    })

    test("Should not create saving due to incomplete form",async()=>{
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("savings",user);
        (fetch as jest.Mock).mockResolvedValue({
            ok:false,
            json: async () => ({ title:"Entertainment",targetAmount:""} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/savings/Nikitha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", targetAmount:""}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Please fill all fields.');
        });
    })

    test("Should create saving due to server error",async()=>{
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("savings",user);
        (fetch as jest.Mock).mockResolvedValue({
            ok:false,
            json: async () => ({ title:"Entertainment",targetAmount:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/savings/Nikitha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", targetAmount:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error occured');
        });
    })

    test("Should not create budget as server error",async()=>{ 
        const user = {username:"Nikitha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
            ok:false,
            json: async () => ({ category:"Entertainment", limit:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API}/budget/Nikitha`, {
                method: "POST",
                body: JSON.stringify({category:"Entertainment", limit:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error occured');
        });
    })
});    