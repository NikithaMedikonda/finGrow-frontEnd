import React from 'react';
import { useContext, useState } from "react";
import Icon from "./icon";
import "../styles/report.css"
import { UserContext } from "../context/context";
import { API } from "../api";
import { transactionItem } from "./transactionItem";

const Report = () => {
    const userContext = useContext(UserContext);
    const [reportType, setReportType] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [reportData, setReportData] = useState<any>(null);
    const [transactions, setTransactions] = useState<[] | string>("");

    if (!userContext) {
        return <>No User Context</>;
    }
    const { user } = userContext;

    if (!user) {
        return <>No User Context</>;
    }

    const handleGenerate = async () => {
        if (!reportType) {
            alert("Please select a report type.");
            return;
        }

        let tag;
        switch (reportType) {
            case "Income & Expenses":
                tag = "income-expenses";
                break;
            case "Budget Summary":
                tag = "budget-summary";
                break;
            case "Savings Progress":
                tag = "savings-progress";
                break;
            default:
                return;
        }

        try {
            let response;
            if (tag === "income-expenses") {
                response = await fetch(`${API}/report/${user.username}/${tag}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startDate, endDate }),
                });
            } else {
                response = await fetch(`${API}/report/${user.username}/${tag}`, {
                    method: "POST"
                });
            }

            if (response.ok) {
                const result = await response.json();
                setReportData(result);

                if (reportType === "Income & Expenses") {
                    const transactionsResponse = await fetch(`${API}/getAllTransactions/${user.username}`);
                    if (transactionsResponse.ok) {
                        const transactionsData = await transactionsResponse.json();
                        setTransactions(transactionsData);
                    }
                }

                if (reportType === "Budget Summary") {
                    const overBudget = result.filter((report: any) =>
                        parseFloat(report.usagePercentage.replace('%', '')) > 90
                    ).map((report: any) => report.category);
                    if (overBudget.length > 0) {
                        alert(`The categories: ${overBudget.join(", ")} have exceeded 90% of the budget limit.`);
                    }
                }

                if (reportType === "Savings Progress") {
                    const highSavings = result.filter((report: any) =>
                        parseFloat(report.progressPercentage.replace('%', '')) > 90
                    ).map((report: any) => report.savingGoal);
                    if (highSavings.length > 0) {
                        alert(`Congratulations! The savings goals: ${highSavings.join(", ")} have exceeded 90%.`);
                    }
                } else {
                    alert("Error generating report. Please try again.");
                }
            }
        } catch (e) {
            alert("error fetching report")
        }
    };

    return (
        <div>
            <Icon type="report" />
            <div className={"reportcontainer"}>
                <div className={"reportContainerone"}>
                    <select
                        data-testid="reportType"
                        id="reportType"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="" disabled>Select a report</option>
                        <option value="Income & Expenses">Income & Expenses</option>
                        <option value="Budget Summary">Budget Summary</option>
                        <option value="Savings Progress">Savings Progress</option>
                    </select>
                    {reportType === "Income & Expenses" && (
                        <div className={"reportdates"}>
                            <input
                                className="reportinput"
                                type="date"
                                data-testid="startDate"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                className="reportinput"
                                type="date"
                                data-testid="endDate"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <button
                    className="reportbutton"
                    onClick={() => handleGenerate()}
                >
                    Generate
                </button>
            </div>

            {reportData && (
                <div className="reportResults">
                    {reportType === "Income & Expenses" && (
                        <>
                            <div className="reportieContainer">
                                <h5>Total Income: {reportData.totalIncome}</h5>
                                <h5>Total Expenses: {reportData.totalExpenses}</h5>
                            </div>

                            <div className="transactionsHeader">
                                <h4>All Transactions</h4>
                            </div>

                            <div className="transactionsList">
                            {transactions && Array.isArray(transactions) ? (
                                    transactions.map((transaction: any) => (
                                        <div key={transaction.id}>
                                            {transactionItem(transaction)}
                                        </div>
                                    ))
                                ) : (
                                    <div>No transactions found for the selected date range.</div>
                                )}
                            </div>
                        </>
                    )}

                    {reportType === "Budget Summary" && Array.isArray(reportData) && reportData.map((report: any, idx: number) => (
                        <div className="reportbudgetContainer" key={idx}>
                            <div className="reportname">{report.category}</div>
                            <div className="reportspent">{report.spent}</div>
                            <div className="reportpercentage">{report.usagePercentage}</div>
                        </div>
                    ))}
                    {reportType === "Savings Progress" && reportData.map((report: any, idx: number) => (
                        <div className="reportbudgetContainer" key={idx}>
                            <div className="reportname">{report.savingGoal}</div>
                            <div className="reportspent">{report.current}</div>
                            <div className="reportpercentage">{report.progressPercentage}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Report;