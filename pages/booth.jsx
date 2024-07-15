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
    
    const props = {};

    //Get active user session information
    const user = req.session.user;
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }

    //GET Member/User Info
    const groupId = query.g
    const boothId = query.b

    console.log("group Id: ", groupId )
    console.log("boothId: ", boothId)

    props.groupId = groupId
    props.boothId = boothId

    const boothExists = await db.group.getGroupBoothById(groupId, boothId)
    
    if (!boothExists) {
      return {
        redirect: {
          permanent: false,
          destination: (`/group/${groupId}`),
        },
        props:{},
      };
    }

    const booth = await db.booth.getBoothById(boothId)

    console.log("booth: ", booth)
    const boothDetails = JSON.parse(JSON.stringify(booth))

    console.log("boothDetails: ", boothDetails)

    if(boothDetails !== null){
      props.booth = boothDetails
    }
    
    return { props };
  },
  sessionOptions
);




export default function BoothPage(props) {
  const router = useRouter();
  const menuType = "group"

  const boothId = props.boothId
  const groupId= props.groupId

  console.log("groupId from booth page: ", groupId)




  async function deleteBooth(e) {
    e.preventDefault()
    const res = await fetch(`/api/booth`, {
      method: 'DELETE',
      headers: 
      {
        "content-type": "application/json",
      },
      body: JSON.stringify({groupId, boothId})
    })
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


      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} menu={menuType} groupId={props.groupId}/>

      <main >
        <div>
          <h1 >
            Booth Details Page
          </h1>
        </div>

        <div >
          <a onClick={deleteBooth} style={{ cursor: 'pointer', fontSize : 20, color: 'blue', textDecoration: 'underline' }}>Delete Booth</a> 
        </div>

        <div>
          <p> Location Name: {props.booth.locationName}</p>
          <p> Date: {props.booth.date}</p>
          <p> Time: {props.booth.time}{props.booth.amPM}</p>
          <p> Number of Shifts: {props.booth.shifts}</p>
          <p> Notes: {props.booth.notes}</p>

        </div>

      </main>

      <Footer/>

    </div>      
   );         
}
