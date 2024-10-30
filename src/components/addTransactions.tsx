import "../styles/addTransactions.css"
import Icon from './icon'
import TransactionForm from '../forms/transactionForm'

const AddTransactions = () => {
  return (
    <div className="addtransactionContainer">
      <Icon type="addTransaction"/>
      <TransactionForm/>
    </div>
  )
}

export default AddTransactions
