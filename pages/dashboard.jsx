import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../components/header";
import Footer from "../components/footer";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from '../db'


//TO DO: Build user dashboard


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

    console.log("user groups: ", userGroups)

    if(userGroups?.length){
      props.userGroups = userGroups
    }

    return { props };
  },
  sessionOptions
);



export default function Dashboard(props) {
  const router = useRouter();

  console.log("user name: ", props.user.name)

  return (
    <div >
      <Head>
        <title>My Cookie Jar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main >
        <div>
          <h1 >
            DASHBOARD
          </h1>
        </div>

        <div>
          <h1>User Info</h1> 
          <h3>User ID:</h3>
          <p>{props.user._id}</p>
          <h3>User name: </h3>
          <p> {props.user.name}</p>
          <h3>User email: </h3>
          <p> {props.user.email}</p>
        </div>

        <div>
          <h1>User Groups</h1>
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
        <p>Group Id: {groupId}</p> 
        <p>Group Name: {groupName}</p>
       </Link>
    </div>  
    
  )
}