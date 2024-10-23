import { useContext, useState } from "react";
import "../styles/form.css";
import { API } from "../api";
import { UserContext } from "../context/context";

const BudgetForm = ({ type }: { type: string }) => {
    const [category, setCategory] = useState('')
    const [limit, setLimit] = useState<string | number>('')
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState<string | number>('')

    const userContext = useContext(UserContext);
    if (!userContext) {
        return <>Context not present</>;
    }

    const { user } = userContext;
    if (!user) {
        return <>NO user</>;
    }

    const handleCreate = async () => {

        if (
            (type === "savings" && (!title || !targetAmount)) ||
            (type === "budget" && (!category || !limit))
        ) {
            alert("Please fill all fields.");
        }

        const tag = type === "savings" ? "savings" : "budget";

        try {
            const response = await fetch(`${API}/${tag}/${user.username}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    type === "savings"
                        ? { title, targetAmount }
                        : { category, limit}
                ),
            });

            if (response.ok) {
                alert(`${tag} created successfully!`);
                resetForm();
            }
            else {
                const result = await response.json();
                alert(`Error occured`)
            }
        } catch (e) {
            alert("An unexpected error occurred while creating.");
        }
    };

    const resetForm = () => {
        if (type === "savings") {
            setTitle("");
            setTargetAmount("");
        } else {
            setCategory("");
            setLimit("");
        }
    };

    return (
        <div className="tformContainer">
            {type === "savings" ? (
                <>
                    <input
                        className="bforminput"
                        type="text"
                        data-testid = "category-input"
                        placeholder="Your Goal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="bforminput"
                        type="number"
                        data-testid = "amount-input"
                        placeholder="Target Amount"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                    />
                </>
            ) : (
                <>
                    <input
                        className="bforminput"
                        type="text"
                        data-testid = "category-input"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <input
                        className="bforminput"
                        type="number"
                        data-testid = "amount-input"
                        placeholder="Amount"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                    />
                </>
            )}
            <button
                type="submit"
                className="bformbutton"
                onClick={handleCreate}
            >
                Create
            </button>
        </div>
    );
};

export default BudgetForm;