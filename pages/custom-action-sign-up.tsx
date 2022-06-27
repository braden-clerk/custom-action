import type { NextPage } from "next";
import styles from "../styles/CustomAction.module.css";
import { useSignUp, useSession, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";

const CustomActionSignUp: NextPage = () => {
  const [render, doRender] = useState(false);

  const { signUp, setSession, isLoaded } = useSignUp();

  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [myJWT, setMyJWT] = useState("");

  if (session) {
    const getJWTFunc = async () => {
      const theJWT = await session.getToken({ template: "good-template" });
      setMyJWT(theJWT!);
    };
    getJWTFunc();
  }

  const newSignUp = async () => {
    if (!signUp) {
      return;
    }

    const res = await signUp.create({});
    doRender(!render);
  };

  const addEmailPassword = async () => {
    if (!signUp || !setSession) {
      return;
    }

    const res = await signUp.update({
      emailAddress: email,
      password: pw,
    });

    if (res.status === "complete") {
      setSession(res.createdSessionId, () => doRender(!render));
      return;
    }

    setEmail("");
    setPw("");
    doRender(!render);
  };
  const addGoogleOauth = async () => {
    if (!signUp || !setSession) {
      return;
    }

    return signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/custom-action-sign-up",
      redirectUrlComplete: "/custom-action-sign-up", // this shouldn't happen, because the sign up should never complete from OAuth, (custom_action will block it)
    });
  };

  const runCustomAction = async () => {
    if (!signUp || !setSession) {
      return;
    }

    await axios.post("/api/a-custom-action", { sign_up_id: signUp.id });
    const res = await signUp.reload();
    if (res.status === "complete") {
      setSession(res.createdSessionId, () => doRender(!render));
      return;
    }

    const theJWT = await session!.getToken({ template: "good-template" });
    setMyJWT(theJWT!);
  };

  return (
    <div className={styles.container}>
      {session?.user && (
        <div className={styles.styledbox}>
          <div>Current Session: {session.id}</div>
          <div>Current User: {session.user.emailAddresses[0].emailAddress}</div>
          <SignOutButton />
        </div>
      )}
      {!session?.user && (
        <div className={styles.styledbox}>
          {signUp?.id && (
            <>
              <div>Current sign up: {signUp.id}</div>
              <div>
                Missing requirements: [{signUp.missingFields.join(", ")}]
              </div>
              <input
                placeholder="email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <button onClick={addGoogleOauth}>Add Google OAuth</button>
              <button onClick={addEmailPassword}>
                Add Email Address / Password
              </button>
              <button onClick={runCustomAction}>
                Run Custom Action for sign up
              </button>
            </>
          )}
          <button onClick={newSignUp}>New sign up</button>{" "}
        </div>
      )}
      {myJWT !== "" && <div className={styles.styledbox}>{myJWT}</div>}
    </div>
  );
};
export default CustomActionSignUp;
