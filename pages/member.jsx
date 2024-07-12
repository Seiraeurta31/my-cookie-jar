//TO DO: Build group dashboard pageimport Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import db from '../db'
import Head from 'next/head';
import Header from "../components/header";
import Footer from "../components/footer";



export const getServerSideProps = withIronSessionSsr (
  async function getServerSideProps({ req, query }) {
    // let { groupId } = useParams();

    const groupId = query.g
    const memberId = query.m

    const props = {};

    props.groupId = groupId

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
    const member = await db.group.getMemberById(groupId, memberId)
    const memberDetails = JSON.parse(JSON.stringify(member))


    if(memberDetails !== null){
      props.mbrDetails = memberDetails
    }

    const memberInfo = await db.user.getUserInfo(memberDetails.userId)
    const memberUserInfo = JSON.parse(JSON.stringify(memberInfo))

    if(memberUserInfo !== null){
      props.mbrUserInfo = memberUserInfo
    }
   
      
    return { props };
  },
  sessionOptions
);




export default function MemberPage(props) {
  const router = useRouter();
  const menuType = "group"



  return (
    <div >
      <Head>
        <title>My Cookie Jar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} menu={menuType} groupId={props.groupId}/>

      <main >
        <div>
          <h1 >
            Member Details Page
          </h1>
        </div>

        <div>
          <p> Member Name: {props.mbrUserInfo.name}</p>
          <p> Member Email: {props.mbrUserInfo.email}</p>
          <p> Member Role: {props.mbrDetails.memberRole}</p>

        </div>

        


      </main>

      <Footer/>

    </div>      
   );         
}
