//TO DO: Build group dashboard pageimport Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from '../../db'
import Link from "next/link";
import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";


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

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} menu={menuType}/>

      <main >
        <div>
          <h1 >
            GROUP PAGE
          </h1>
        </div>

        <div>
          <h3>Group Details</h3>
          <p> Group Id:  {props.group.id}</p>
          <p> Group Name: {props.group.groupName}</p>
          <p> Group Code: {props.group.groupCode}</p>
        </div>

        <div>
          <h1>Group Members</h1>
          {props.group.groupMembers ? (
            <>
              {props.group.groupMembers.map((member, i) => (
                <GroupMembers 
                  key={i}
                  groupId={props.group.id}
                  memberId={member.userId} 
                  memberRole={member.memberRole}
                  id={member._id}>
                </GroupMembers>
              ))}
            </>
            ):( 
              <>
                <p >No user groups yet!</p>
              </>
          )}
        </div>

        <div>
          <h1>Booths</h1>
          {props.group.groupBooths ? (
            <>
              {props.group.groupBooths.map((booth, i) => (
                <GroupBooths 
                  key={i}
                  boothId={booth.boothId} 
                  id={booth._id}>
                </GroupBooths>
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