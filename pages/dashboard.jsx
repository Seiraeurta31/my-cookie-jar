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

    if(userGroups?.length){
      props.userGroups = userGroups
    }

    return { props };
  },
  sessionOptions
);



export default function Dashboard(props) {
  const router = useRouter();

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
      </main>

      <Footer/>
    </div>
  );
}

