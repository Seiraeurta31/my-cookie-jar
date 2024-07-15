//TO DO: Build group dashboard pageimport Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from '../../db'
import Link from "next/link";
import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";
// import group from "../api/group";


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
    const group = await db.group.getGroupById(params.id)
    const groupConverted = JSON.parse(JSON.stringify(group))

    //check if user is member
    const member = await db.group.getMemberByUserId(groupConverted.id, user._id)
    if (!member) {
        return {
          redirect: {
            permanent: false,
            destination: "/dashboard",
          },
          props:{},
        };
    }

    


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

  const groupId = props.group.id
  console.log("groupId: ", groupId)

  const userId = props.user._id
  console.log("user: ", userId)

  async function leaveGroup(e) {
    e.preventDefault()
    const res = await fetch(`/api/user`, {
      method: 'DELETE',
      headers: 
      {
        "content-type": "application/json",
      },
      body: JSON.stringify({userId, groupId})
    })
    console.log("Deleted drink ID response: ", res)
    // Call router.replace(router.asPath) if you receive a 200 status
    if (res.status === 200) {
      router.replace(router.asPath)
    }  
  }


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
          <h1 >
            {props.group.groupName} Home Page
          </h1>
        </div>


        <div>
          <Link href={`/membersList/${props.group.id}`}>Group Member List</Link>
        </div> 

        <div>
          <Link href={`/boothList/${props.group.id}`}>Troop Booth List</Link>
        </div>   

        <div>
          <Link href={`/inventory/${props.group.id}`}>Cookie Inventory</Link>
        </div> 

        <div>
          <a onClick={leaveGroup} style={{ cursor: 'pointer', fontSize : 16, color: 'blue', textDecoration: 'underline' }}>Leave Group</a> 
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

function GroupBooths({boothId, id}) {

  return (
    <div>
      <Link href={'/booth/' + boothId}>
        <h3>BoothId#</h3>
        <p>{boothId}</p>
        <h3>GroupBooth Id#</h3>
        <p>{id}</p>
      </Link>
    </div>  
    
  )
}