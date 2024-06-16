//TO DO: Build group dashboard pageimport Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import db from '../../db'
import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";


//TO DO: Build user dashboard


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
    const booth = await db.booth.getBoothById(user._id, params._id)
    
    if(booth !== null){
        props.booth = booth
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
                BOOTH PAGE
              </h1>
                
          
        </div>
      </main>

      <Footer/>
    </div>
  );
}
