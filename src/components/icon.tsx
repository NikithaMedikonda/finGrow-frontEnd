import "../styles/tagicon.css"
import { GrTable } from "react-icons/gr";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { MdMoney } from "react-icons/md";
import { TbReport } from "react-icons/tb";

const Icon = ({ type }: { type: string }) => {
    let heading;
    let IconComponent;
    
    if (type === "addTransaction") {
        heading = "Add Transaction";
        IconComponent = GrTable;
    } else if (type === "create-budget") {
        heading = "Create Budget";
        IconComponent = BsFillPersonCheckFill;
    } else if (type === "create-saving") {
        heading = "Create Saving Goal";
        IconComponent = FaHandHoldingMedical;
    } else if (type === "recent-transactions") {
        heading = "Recent transactions";
        IconComponent = MdMoney;
    } else {
        heading = "Generate Reports"
        IconComponent = TbReport;

    }
    return (
        <div className={"tagIconContainer"}>
            <div data-testid="icon-container" className={"iconContainer"}>
                <IconComponent size={20} color="blue" />
            </div>
            <div className={"tagContainer"}>
                <h3>{heading}</h3>
            </div>
        </div>
    );
};

export default Icon;
