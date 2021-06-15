import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { DeleteSharp, MoreVert } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import db from '../firebase'
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router"

const SidebarChat = ({ id, users, lastMessage }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);
    const goToChatScreen = () => {
        router.push(`/chat/${id}`);
    }
    const ChatOption = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div
            onClick={goToChatScreen}
            style={{
                padding: "20px"
            }}
            className={"w-full focus:outline-none text-left flex items-center cursor-pointer hover:bg-white border-b bg-gray-100 hover:transition-all"}
        >
            {recipient ?
                <Avatar src={recipient?.photoURL} />
                :
                <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
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


        </div >
    )
}

export default SidebarChat
