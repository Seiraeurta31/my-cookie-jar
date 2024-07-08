import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import { useState } from "react";



export default function CreateGroup(props) {
    const router = useRouter();
    const [
      { groupName, groupCode},
      setForm,
    ] = useState({
      groupName: "",
      groupCode: "",
    });
    const [error, setError] = useState("");
  
    function handleChange(e) {
      setForm({
        groupName,
        groupCode,
        ...{ [e.target.name]: e.target.value.trim() },
      });
    }
    async function handleCreateAccount(e) {
      e.preventDefault();
      if (!groupName) return setError("Must include group name");
      if (!groupCode) return setError("Must include group code");
  
      try {
        const res = await fetch("/api/group", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ groupName, groupCode }),
        });
        if (res.status === 200) return router.push("/dashboard");
        const { error: message } = await res.json();
        setError(message);
      } catch (err) {
        console.log(err);
      }
    }





    return (
      <div >
        <Head>
          <title>Sign Up</title>
          <meta name="description" content="Generated by create next app" />
        </Head>
  
        <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
  
        <main>
          <h1>
            Search A Group To Join!
          </h1>
  
  
          <form
            onSubmit={handleCreateAccount}
          >
            <label htmlFor="groupName">Group Name: </label>
            <input
              type="text"
              name="groupName"
              id="groupName"
              onChange={handleChange}
              value={groupName}
            />
  
            <label htmlFor="groupCode">Group Code: </label>
            <input
              type="text"
              name="groupCode"
              id="groupCode"
              onChange={handleChange}
              value={groupCode}
            />
  
            <button>Submit</button>
            {error && <p>{error}</p>}
          </form>
        </main>
  
        <Footer/>
      </div>
    );
  }