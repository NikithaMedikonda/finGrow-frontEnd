import { useContext, useState } from "react";
import "../styles/form.css";
import { API} from "../api";
import { UserContext } from "../context/context";

const TransactionForm = () => {
    const [name, setName] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [amount, setAmount] = useState<string | number>("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");

    const userContext = useContext(UserContext);
    if (!userContext) {
        return <>Context not present</>;
    }

    const { user, setAdd } = userContext;
    if (!user) {
        return <>NO user</>;
    }

    const handleAdd = async () => {
        if (!name || !transactionType || !amount || !date || !category) {
            alert("Please fill all fields.");
            return;
        }
        try {
            const response = await fetch(
                `${API}/transaction/${user.username}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, transactionType, amount, date, category }),
                }
            );
            if (response.ok) {
                setAdd(true);
                alert(`Transaction created`);
                setName("");
                setTransactionType("");
                setAmount("");
                setDate("");
                setCategory("");
            } else {
                const result = await response.json();
                alert(`Something went wrong`);
            }
        } catch (e) {
            alert("Error while adding transaction");
        }
    };

    return (
        <div className="transactionFormContainer">
            <div className="column">
                <input 
                    className="tforminput"
                    placeholder="Transaction Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    className="tforminput"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input className="tforminput"
                    placeholder="Type"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                />
                <input className="tforminput"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input className="tforminput"
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="tbutton" 
                    onClick={() => handleAdd()}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default TransactionForm;
