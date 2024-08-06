//TO DO: Build group dashboard pageimport Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from '../../db'
import Link from "next/link";
import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";
import styles from "../../styles/boothList.module.css"




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
    
    const activeMember = await db.group.getMemberByUserId(groupConverted.id, user._id)
    if (!activeMember) {
        return {
          redirect: {
            permanent: false,
            destination: "/dashboard",
          },
          props:{},
        };
    }

    console.log("GROUP: ", group)
    
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
  const pageTitle = `${props.group.groupName}`

  return (
    <div >
      <Head>
        <title>My Cookie Jar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} menu={menuType} pageTitle={pageTitle} groupId={props.group.id}/>


      <main className={styles.main}>

        <div className={styles.mainContainer}>

          <Link href={`/boothForm?g=${props.group.id}`} className={styles.button}>
            <p> Add Booth</p>
          </Link>
         
        </div>

        <div className={styles.listContainer}>
          <div>

            <h1 className={styles.sectionTitle}> Booths</h1>

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
                    numShifts={booth.numShifts}
                    registered={booth.registered ? booth.registered.length : 0}>

                  </GroupBooths>

                ))}
              </>
              ):( 
              <>
                <div className={styles.instructions}> 
                  <p style={{fontSize:"20px", textAlign: "center"}}> No Booths Yet! </p>
                  <p style={{textAlign: "center", textWrap: "balance", margin: "10px"}}> Open a booth listing by selecting the "Add Booth" button above. </p>
                </div>
              </>
            )}
          </div>
        </div>  
      </main>

      <Footer/>

    </div>      
   );         
}

//TO DO: Add Registered count to group booths info model
function GroupBooths({groupId, boothId, locationName, date, time, amPM, numShifts, registered}) {

  return (
    <div>
      <Link href={`/booth?g=${groupId}&b=${boothId}`}>
      <div className={styles.boothContainer}>

    
       <p className={styles.infoName}>{locationName}</p>
        

        <div className={styles.boothInfo}>
          <div className={styles.locationInfo}>
            <p className={styles.infoItem}>{date}</p>
            <p className={styles.infoItem}>{time} {amPM}</p>
          </div>
          <div className={styles.shiftInfo}>
            <div>
              <p className={styles.numShift}>{numShifts - registered}</p>
            </div> 
            <p className={styles.infoItem}> Girls<br></br> Allowed </p>
              
          </div>
          
        </div>
      </div>
        
        
      </Link>
    </div>  
    
  )
}


