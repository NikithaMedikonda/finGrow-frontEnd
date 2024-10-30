export const transactionItem = (transaction: any) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getUTCFullYear();
        return `${day} ${month} ${year}`;
    };

    return <>
        <div className="transaction">
            <div className="transactiondetails">
                <div className="transactionleft">
                    <p>
                        {transaction.name} | {transaction.category}
                    </p>
                    <p className="transactiondate">{formatDate(transaction.date)}</p>
                </div>
                <div className={`${"transactionright"} ${transaction.transactionType === "credit" ? "green" : "red"}`}>
                    {transaction.transactionType === "credit" ? "+" : "-"}Rs.
                    {transaction.amount}
                </div>
            </div>
        </div>
    </>
}