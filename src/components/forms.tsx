import Budget from "./budget";
import Savings from "./savings";
import AddTransactions from "./addTransactions";
import Statements from "./statement";
import "../styles/forms.css"

const Forms = () => {
    return (
        <>
        <div className="formsheader">
        <h3>Record Expenses</h3></div>
        <div className="formscontainer">  
            <div className="formtransactions">
                <AddTransactions/>
            </div>       
            <div className="budget-savings">
                <Budget/>
                <Savings/>
            </div>
            <div className="formtransactions">
                <Statements/>
            </div> 
        </div>
        </>
    );
};

export default Forms;
