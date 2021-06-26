import { Avatar, CircularProgress, } from "@material-ui/core";
import React, { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import db from '../firebase'
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router"

const SidebarChat = ({ id, users, lastMessage }) => {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [display, setDisplay] = useState("none")
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);
    const goToChatScreen = () => {
        setDisplay("block")
        router.push(`/`);
        router.push(`/chat/${id}`);
    }
    return (
        <div
            onClick={goToChatScreen}
            style={{
                padding: "20px",
            }}
            className={"w-full dark:hover:bg-gray-500 focus:outline-none text-left flex items-center cursor-pointer hover:bg-white border-b bg-gray-100 dark:bg-gray-600 dark:border-gray-700 dark:text-gray-200 hover:transition-all"}
        >
            {recipient ?
                <Avatar src={recipient?.photoURL} />
                :
                <Avatar />
            }
            {recipient ?
                <div className={"ml-2 mr-3"}>
                    <h1 className={"text-lg font-semibold "}>{recipient?.name}</h1>

                </div>
                :
                <div className={"ml-2 mr-3"}>
                    <h1 className={"text-md font-semibold "}>{recipientEmail}</h1>
                </div>
            }
            <CircularProgress
                size={50}
                thickness={4}
                style={{
                    color: "#9CA3AF",
                    display: display,
                    height: "35px",
                    width: "35px"
                }}
                className={"ml-auto focus:outline-none"}
            />

        </div >
    )
}

export default SidebarChat
