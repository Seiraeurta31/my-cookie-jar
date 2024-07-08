import Link from "next/link";
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
                <Link href="/dashboard">Dashboard    </Link>
                <Link href="/createGroup">Create Group    </Link> 
                <Link href="/joinGroup">Join Group    </Link>
                <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 
              </>
              ) : (
                <div>  
                </div>
            )}
          </div>

          <div >
            {props.menu === "group" ? (
              <>
                <Link href="/dashboard">Dashboard    </Link>
                <Link href="/addGroup">Group Main    </Link> 
                <Link href="/joinGroup">Members List    </Link>
                <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 
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


