import { Button } from "@material-ui/core";
import Head from "next/head";
import { auth, googleAuthProvider } from '../firebase.js'
import { useRouter } from 'next/router'
import styled from "styled-components"

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
                className={"dark:bg-gray-500 bg-white text-center shadow-2xl"}
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
                <Btn onClick={googleSignin} style={{  marginBottom: "5px" }} className={"dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 w-52 bg-gray-200 focus:outline-none"}>Login with Google</Btn>
            </div>
        </div >
    );
}

export default Login

const Btn = styled(Button)`
background-color: rgba(0, 0, 0, 0.06)
`;