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
            if (!userContext || !userContext.user) {
                return;
            }

            try {
                const { user, setAdd } = userContext;
                const response = await fetch(`${API}/getTransactions/${user.username}`);
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                    setAdd(false);
                } else {
                    setTransactions([]);
                }
            } catch (e) {
               alert("Failed to fetch transactions");
            }
        };
        fetchTransactions();
    }, [userContext]);

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