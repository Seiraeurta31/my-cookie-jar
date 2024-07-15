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


    const group = await db.group.getGroupById(params.groupId)
    const groupConverted = JSON.parse(JSON.stringify(group))

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
        </div>
        <div>
          <h2>Group Booths</h2>

          <Link href={`/boothForm?g=${props.group.id}`}>
            <h3>Add New Booth</h3>
          </Link>

          {props.group.groupBooths.length ? (
            <>
              {props.group.groupBooths.map((booth, i) => (
                <GroupBooths 
                  key={i}
                  groupId={props.group.id}
                  boothId={booth.boothId}
                  locationName={booth.locationName} 
                  date={booth.date} 
                  time={booth.time} 
                  amPM={booth.amPM}
                  numShifts={booth.shifts}> 
                </GroupBooths>
              ))}
            </>
            ):( 
            <>
              <p >No group booths yet!</p>
            </>
          )}
        </div>
   
      </main>

      <Footer/>

    </div>      
   );         
}


function GroupBooths({groupId, boothId, locationName, date, time, amPM, numShifts}) {
  return (
    <div>
      <Link href={`/booth?g=${groupId}&b=${boothId}`}>
        <p>Booth Id: {boothId} </p>
        
      </Link>
        

    </div>  
    
  )
}


