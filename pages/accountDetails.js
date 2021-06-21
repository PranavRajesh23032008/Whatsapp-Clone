import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { auth } from "../firebase"
import { useRouter } from "next/router"
import Head from "next/head"
import { IconButton } from '@material-ui/core';
import styled from "styled-components"
import useDarkMode from "../useDarkMode";

const accountDetails = () => {
    const [colorTheme, setTheme] = useDarkMode();
    if (colorTheme === "dark") {
        document.body.style.backgroundColor = "#fff";
      } else {
        document.body.style.backgroundColor = "#555B63";          
      }
    const user = auth.currentUser
    const router = useRouter()
    const goBack = () => {
        router.push("/")
    }
    return (
        <AccountDetails style={{ height: "100vh" }} className={"w-72 bg-gray-200 dark:bg-gray-500"}>
            <Head>
                <title>
                    Account Details
                </title>
            </Head>
            {/* Top of Sidebar */}
            <div className={"text-white px-2 py-5 w-full text-lg bg-whatsapp_green"}>
                <ButtonIconAccountDetails className={"mr-3"}>
                    <ArrowBackIcon onClick={goBack} className={"cursor-pointer text-white"} />
                </ButtonIconAccountDetails>
                <span className={"ml-1"}>Profile</span>
            </div>
            {/* Details */}
            <img src={user.photoURL} className={"rounded-full h-52 w-52 my-5 mx-auto"} />

            <div className={"bg-white dark:bg-gray-400 shadow-sm px-5 py-2 mb-2"}>
                <div className={"text-whatsapp_green text-sm font-semibold"}>
                    Your Name
                </div>
                <p className={"my-2 text-gray-400 dark:text-white text-md"}>
                    {user.displayName}
                </p>
            </div>
            <div className={"bg-white dark:bg-gray-400 shadow-sm px-5 py-2 mb-2"}>
                <div className={"text-whatsapp_green text-sm font-semibold"}>
                    Your Email
                </div>
                <p className={"my-2 text-gray-400 dark:text-white text-md"}>
                    {user.email}
                </p>
            </div>
            
        </AccountDetails>
    )
}

export default accountDetails

const AccountDetails = styled.div`
width:100%;
height: 100vh;
@media (min-width: 768px) {
    width: 330px
};
`;

const ButtonIconAccountDetails = styled(IconButton)`
padding: 10px;
:focus {outline: none}
`