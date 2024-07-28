import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../components/header";
import Footer from "../components/footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from '../db'
import styles from "../styles/dashboard.module.css";


export const getServerSideProps = withIronSessionSsr (
  async function getServerSideProps({ req }) {

    const props = {}

    //Get user session information
    const user = req.session.user;
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props:{},
        };
    }


    //TO DO: Get user groups 
    const userGroups = await db.user.getUserGroups(user._id)

    if(userGroups?.length){
      props.userGroups = userGroups
    }

    return { props };
  },
  sessionOptions
);



export default function Dashboard(props) {
  const router = useRouter();
  const menuType = "user"
  const pageTitle = "Dashboard"

  return (
    <div >
      <Head>
        <title>My Cookie Jar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} menu={menuType} pageTitle={pageTitle}/>

      <main className={styles.main}>

        <h1> My Groups</h1>

        <div className={styles.mainContainer}>
          {props.userGroups ? (
            <>
              {props.userGroups.map((group, i) => (
                <UserGroups 
                  key={i}
                  groupId={group.groupId} 
                  groupName={group.groupName}>
                </UserGroups>
              ))}
            </>
            ):( 
              <>
                <p >No user groups yet!</p>
              </>
          )}
        </div>
      </main>

      <Footer/>

    </div>      
   );         
}


function UserGroups({groupId, groupName}) {
  const noImage = "/No_image_available.svg.png"
  return (
    <div>
       <Link href={'/group/' + groupId}>
        <p> {groupName}</p>
       </Link>
    </div>  
    
  )
}