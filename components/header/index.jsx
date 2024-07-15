
import useLogout from "../../hooks/useLogout";
import Link from "next/link";


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
                <Link href="/dashboard">Dashboard    </Link>
              </div>
                
              <div>
                <Link href="/createGroup">Create Group    </Link> 
              </div>
                
              <div>
                <Link href="/joinGroup">Join Group    </Link>
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
                <Link href="/dashboard">Dashboard </Link>
              </div>

              <div>
                <Link href={'/group/' + props.groupId}>Home Page   </Link> 
              </div>
                
              <div>
                <Link href={`/membersList/${props.groupId}`}>Members List    </Link>
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


