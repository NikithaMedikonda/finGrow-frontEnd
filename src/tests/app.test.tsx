import { render, screen } from "@testing-library/react";
import App from "../App";
import { UserProvider} from "../context/context"

jest.mock("../Pages/login", () => () => <div>Login Page</div>);
jest.mock("../Pages/registration", () => () => <div>Registration Page</div>);
jest.mock("../Pages/dashboard", () => () => <div>Dashboard Page</div>);

describe("App Routing and Context", () => {
    const renderWithProviders = () => {
        return render(
            <UserProvider>
                <App />
            </UserProvider>
        );
    };

    test("should render the Login Page on the root route (/)", () => {
        window.history.pushState({}, "", "/"); 
        renderWithProviders();
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    test("should navigate to the Registration Page when the route is /register", () => {
        window.history.pushState({}, "", "/register"); 
        renderWithProviders();
        expect(screen.getByText("Registration Page")).toBeInTheDocument();
    });

    test("should navigate to the Dashboard Page when the route is /dashboard", () => {
        window.history.pushState({}, "", "/dashboard"); 
        renderWithProviders();
        expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });
});