import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";


export const getServerSideProps =  withIronSessionSsr(
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
)


export default function Login(props) {

  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");


  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }


  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) return router.push("/dashboard");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }


  
  return (
    <div>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main>
        <h1>
          LogIn Page
        </h1>

        <form
          onSubmit={handleLogin}
        >
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <button>Login</button>
          {error && <p>{error}</p>}
        </form>





        <Link href="/signup">
          <p>Signup instead?</p>
        </Link>

      </main>

      <Footer/>
    </div>
  );
}
