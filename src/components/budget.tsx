import Icon from './icon'
import BudgetForm from '../forms/budgetForm'

const Budget = () => {
  return (
    <div>
      <Icon data-testid="budget-icon" type="create-budget"/>
      <BudgetForm data-testid="budget-form" type="budget"/>
    </div>
  )
}

export default Budget
