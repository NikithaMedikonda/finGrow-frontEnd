import { useContext } from 'react'
import { UserContext } from '../context/context'
import "../styles/welcome.css"

const Welcome = () => {
  const userContext  = useContext(UserContext);
  if(!userContext){
    return <>Context not present</>
  }

  const {user} = userContext

  if(!user){
    return <></>
  }

  return (
    <div className="welcomecontainer">
      <div className="welcomeheader">
      <p>Welcome <span className="welcomespanContent">{user.username}</span></p>
        <h3>Your One Stop <span className="welcomespanContent">Finance <br/> Management System</span></h3>
      </div>
      <div>
        <img className="welcomeimg" src='./assets/image.jpg'/>
      </div>
    </div>
  )
}

export default Welcome
