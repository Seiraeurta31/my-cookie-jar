import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";
// import welcomeImg  from "../../public/Welcome.jpg";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header>
      {props.isLoggedIn ? (
        <>
          <div >
            <Link href="/">Home</Link>
            <Link href="/favorites">Favorites</Link>
            <Link href="/search">Search</Link>
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


