import { useContext, useEffect, useState } from "react";
import Icon from "./icon";
import "../styles/transactions.css"
import { UserContext } from "../context/context";
import { API } from "../api";
import { transactionItem } from "./transactionItem";

const Transactions = () => {
    const userContext = useContext(UserContext);
    const [transactions, setTransactions] = useState<[] | string>("");

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!userContext) {
                return;
            }
            const { user, setAdd } = userContext;
            if (!user) {
                setTransactions("No User");
                return;
            }

            try {
                const response = await fetch(`${API}/getTransactions/${user.username}`);
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                    setAdd(false);
                } else {
                    console.log("Error fetching transactions");
                    setTransactions([]);
                }
            } catch (e) {
                console.log(e);
                setTransactions([]);
            }
        };
        fetchTransactions();
    }, [userContext?.user?.username, userContext?.add]);

    return (
        <div className="transactionsContainer">
            <Icon type="recent-transactions" />
           
            <div className="transactionHeader">
                <h4>Transaction | Category</h4>
                <h4>Amount</h4>
            </div>

            {Array.isArray(transactions) ? (
                transactions.map((transaction: any) => (
                    <div key={transaction.id}>
                        {transactionItem(transaction)}
                    </div>
                ))
            ) : (
                <div>No recent Transactions Found</div>
            )}
        </div>
    );
};

export default Transactions;