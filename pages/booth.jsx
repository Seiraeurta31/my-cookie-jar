//TO DO: Build group dashboard pageimport Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from '../db'
import Head from 'next/head';
import Header from "../components/header";
import Footer from "../components/footer";



export const getServerSideProps = withIronSessionSsr (
  async function getServerSideProps({ req, params }) {

    const props = {};

    //Get user session information
    const user = req.session.user;
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }

        //TO DO: Get user groups 
    // const group = await db.group.getGroupById(user._id, params.id)
    const group = await db.group.getGroupById(params.groupId)
 
    const groupConverted = JSON.parse(JSON.stringify(group))

    //TO DO: Parsing turns it to Javascript to read in browser


    if(group !== null){
        props.group = groupConverted
      }

    return { props };
  },
  sessionOptions
);


export default function GroupPage(props) {
  const router = useRouter();
  const menuType = "group"

  return (
    <div >
      <Head>
        <title>My Cookie Jar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} menu={menuType} groupId={props.group.id}/>

      <main >

        <div>
          <h1 >Troop Booth List</h1>
          <h3> Page In Progress</h3>
        </div>
   
      </main>

      <Footer/>

    </div>      
   );         
}


function GroupMembers({memberId, memberRole, groupId, id}) {

  return (
    <div>
      <Link href={'/member/' + groupId}>
        <h3>Member Info</h3>
        <p>User Id: {memberId}</p>
        <p>Member Role: {memberRole}</p>
      </Link>
        

    </div>  
    
  )
}

