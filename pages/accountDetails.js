import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { auth } from "../firebase"
import { useRouter } from "next/router"
import Head from "next/head"
import { IconButton } from '@material-ui/core';
import styled from "styled-components"


const accountDetails = () => {
    const user = auth.currentUser
    const router = useRouter()
    const goBack = () => {
        router.push("/")
    }
    return (
        <AccountDetails style={{ height: "100vh", backgroundColor: "#EDEDED" }} className={"w-72"}>
            <Head>
                <title>
                    Account Details
                </title>
            </Head>
            {/* Top of Sidebar */}
            <div style={{ backgroundColor: "#00bfa5" }} className={"text-white px-2 py-5 w-full text-lg"}>
                <IconButton className={"focus:outline-none mr-3"}>
                    <ArrowBackIcon onClick={goBack} className={"cursor-pointer text-white"} />
                </IconButton>
                <span className={"ml-1"}>Profile</span>
            </div>
            {/* Details */}
            <img src={user.photoURL} className={"rounded-full h-52 w-52 my-5 mx-auto"} />

            <div className={"bg-white shadow-sm px-5 py-2 mb-2 mb-1"}>
                <div style={{ color: "#00bfa5" }} className={"text-sm font-semibold"}>
                    Your Name
                </div>
                <p className={"my-2 text-gray-400 text-md"}>
                    {user.displayName}
                </p>
            </div>
            <div className={"bg-white shadow-sm px-5 py-2 mb-2"}>
                <div style={{ color: "#00bfa5" }} className={"text-sm font-semibold"}>
                    Your Email
                </div>
                <p className={"my-2 text-gray-400 text-md"}>
                    {user.email}
                </p>
            </div>
        </AccountDetails>
    )
}

export default accountDetails

const AccountDetails = styled.div`
@media (max-width: 769px) {
    width: 100%
  }`;
