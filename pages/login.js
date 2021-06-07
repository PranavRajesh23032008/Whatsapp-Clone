import { Button } from "@material-ui/core";
import Head from "next/head";
import { auth, googleAuthProvider } from '../firebase.js'
import { useRouter } from 'next/router'
import { useEffect } from "react";

const Login = () => {
    const googleSignin = () => {
        auth.signInWithRedirect(googleAuthProvider)
    }

    const router = useRouter()

    return (
        <div className={""}>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
                className={"bg-white text-center shadow-2xl"}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%) translateY(-50%)",
                    borderRadius: "5px",
                    padding: 50,
                    borderRadius: 10
                }}
            ><img
                    className={"cursor-pointer  h-52 w-52 mb-10"}
                    src="http://www.heretailshop.com/image/catalog/598px-WhatsApp.svg.png"
                />
                <Button onClick={googleSignin} style={{ backgroundColor: "rgba(0, 0, 0, 0.06)", marginBottom: "5px" }} className={"w-52 focus:outline-none"}>Login with Google</Button>
            </div>
        </div >
    );
}

export default Login