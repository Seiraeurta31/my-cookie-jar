import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../components/header";
import Footer from "../components/footer";
import { withIronSession } from "next-iron-session";
import sessionOptions from '../config/session';


export const getServerSideProps = withIronSession (
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }

    return { props };
  },
  sessionOptions
);


export default function Home(props) {
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
          {props.isLoggedIn ? (
            <>
              <h1 >
                You Are Logged In
              </h1>
                
            </>
          ) : (
            <>
              <div>
                <h1>
                  Welcome to My Cookie Jar
                </h1>
                <h2>
                  Log in or Sign up!
                </h2>
              </div>
              
              <div>
                  <Link href="/login">
                    <h2>Login </h2>
                  </Link>

                  <Link href="/signup">
                    <h2>Sign Up </h2>
                  </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer/>
    </div>
  );
}

