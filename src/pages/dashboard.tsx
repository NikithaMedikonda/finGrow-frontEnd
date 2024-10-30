import Forms from "../components/forms";
import Welcome from "../components/welcome";
import "../styles/dashboard.css"

const Dashboard: React.FC = () => {
    return (
        <div className="maincontainer">
        <div className="dashboardheader">
        <h4>Fin<span className="dashboardspanContent">Grow</span></h4>
        </div>
        <Welcome/>
        <Forms/>
    </div>
    );
}

export default Dashboard
