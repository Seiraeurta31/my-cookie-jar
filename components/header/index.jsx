
import useLogout from "../../hooks/useLogout";


export default function Header(props) {
  const logout = useLogout();
  return (
    <header>
      {props.isLoggedIn ? (
        <>         
          <div >
            {props.menu === "user" ? (
              <>
              <div>
                <a href="/dashboard">Dashboard    </a>
              </div>
                
              <div>
                <a href="/createGroup">Create Group    </a> 
              </div>
                
              <div>
                <a href="/joinGroup">Join Group    </a>
              </div>

              <div>
                <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 
              </div>
                
              </>
              ) : (
                <div>  
                </div>
            )}
          </div>

          <div >
            {props.menu === "group" ? (
              <>
              <div>
                <a href="/dashboard">Dashboard </a>
              </div>

              <div>
                <a href={'/group/' + props.groupId}>Home Page   </a> 
              </div>
                
              <div>
                <a href={`/membersList/${props.groupId}`}>Members List    </a>
              </div>
                
              <div>
                <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 

              </div>
                
              </>
            ) : (
              <div>  
              </div>
            )}
          </div>
        </>
      ) : ( 
          <div>  
          </div>
      )}
    </header>
  );
}


