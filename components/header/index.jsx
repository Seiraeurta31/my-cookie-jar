
import useLogout from "../../hooks/useLogout";
import Link from "next/link";
import styles from "./style.module.css";
import Image from 'next/image';


export default function Header(props) {
  const logout = useLogout();
  return (
    <header >

      <div className={styles.header}>

        {props.isLoggedIn ? (          
          <>         

              <div className={styles.headerContainer}>

                <div>
                    <Image alt="cookie jar logo" src="/cookieJarLogo_Circle.png" className={styles.logoIcon} width="120" height="125"/>
                </div> 

                <div className={styles.titleAndNav}>
                  <div>
                    <h1 className={styles.pageTitle}>{props.pageTitle}</h1>
                  </div>
                  {props.menu === "user" ? (
                    <>
                      <div className={styles.navContainer}>
                        <div >
                          <Link href="/dashboard" className={styles.navLink}>Home </Link>
                        </div>
                        <div>
                          <Link href="/createGroup" className={styles.navLink}>Create  Group </Link> 
                        </div>
                        <div>
                          <Link href="/joinGroup" className={styles.navLink}>Join  Group </Link>
                        </div>
                        <div>
                          <a onClick={logout} style={{ cursor: "pointer" }} className={styles.navLink}>Logout</a> 
                        </div>
                      </div>  

                    </>
                    ) : (
                      <div> 
                      </div>
                    )}

                    {props.menu === "group" ? (
                      <>
                        <div className={styles.groupNavContainer}>
                          
                          <div >  
                            <Link href="/dashboard" className={styles.navLink}> Home </Link>
                          </div>
                          <div>
                            <Link href={'/group/' + props.groupId} className={styles.navLink}>Menu </Link>
                          </div>
                          {/* <div>
                            <Link href={`/boothList/${props.groupId}`} className={styles.navLink}>Booths</Link>
                          </div> */}
                          <div>
                            <a onClick={logout} style={{ cursor: "pointer" }} className={styles.navLink}>Logout</a> 
                          </div>

                        </div> 
                      </>
                    ) : (
                      <div>  
                      </div>
                    )}


                </div>
            </div>
          </>
        ) : ( 
          <div>  
          </div>
        )}
      </div>
    </header>
  );
}


