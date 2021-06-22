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
        document.body.style.backgroundColor = "#6B7280";          
      }
    const user = auth.currentUser
    const router = useRouter()
    const goBack = () => {
        router.push("/")
    }
    return (
        <AccountDetails style={{ height: "100vh" }} className={" w-72 bg-gray-100 dark:bg-gray-600"} >
            <Head>
                <title>
                    Account Details
                </title>
            </Head>
            {/* Top of Sidebar */}
            <div className={"dark:border-gray-800 dark:border-r bg-gray-200 dark:bg-gray-700 flex items-center p-5 text-white px-2 py-5 w-full text-lg"}>
                <ButtonIconAccountDetails className={"mr-3"}>
                    <ArrowBackIcon onClick={goBack} className={"cursor-pointer dark:text-white"} />
                </ButtonIconAccountDetails>
                <span className={"ml-1 text-gray-600 dark:text-white"}>Profile</span>
            </div>
            {/* Details */}
            <img src={user.photoURL} className={"rounded-full h-52 w-52 my-5 mx-auto"} />

            <div className={"bg-white dark:bg-gray-500 shadow-md px-5 py-2 mb-2"}>
                <div className={"text-gray-600 dark:text-gray-200 text-sm font-semibold"}>
                    Your Name
                </div>
                <p className={"my-2 dark:text-gray-300 text-gray-500 text-md"}>
                    {user.displayName}
                </p>
            </div>
            <div className={"bg-white dark:bg-gray-500 shadow-md px-5 py-2 mb-2"}>
                <div className={"text-gray-600 dark:text-gray-200 text-sm font-semibold"}>
                    Your Email
                </div>
                <p className={"my-2 dark:text-gray-300 text-gray-500 text-md"}>
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