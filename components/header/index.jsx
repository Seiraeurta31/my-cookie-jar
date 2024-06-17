import Link from "next/link";
import useLogout from "../../hooks/useLogout";


export default function Header(props) {
  const logout = useLogout();
  return (
    <header>
      {props.isLoggedIn ? (
        <>
          <div >
            <Link href="/dashboard">Home</Link>
            <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a> 
          </div>   
        </>
      ) : ( 
          <div>  
          </div>
      )}
    </header>
  );
}


