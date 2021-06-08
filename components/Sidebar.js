import { Avatar, Menu, MenuItem, IconButton } from "@material-ui/core"
import { auth } from '../firebase'
import db from '../firebase'
import styled from "styled-components"
import { AccountCircle, Chat, ExitToApp, ExitToAppOutlined, MoreVertOutlined } from "@material-ui/icons"
import SidebarChat from './SidebarChat'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import * as EmailValidator from 'email-validator';
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth"

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter()
    var [prompt, setPrompt] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const userChatsReference = db
        .collection("chats")
        .where("users", "array-contains", user?.email);
    const [chatsSnapshot] = useCollection(userChatsReference);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const ViewAccountDetails = () => {
        router.push("/accountDetails")
    }

    const signOut = () => {
        // Change this 👇 if it does not work
        router.push("/")
        auth.signOut()
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const createChat = (e) => {
        e.preventDefault()
        console.log("Chat Created!")
        prompt = prompt.toLowerCase()
        const chatAlreadyExist = (recipientEmail) =>
            !!chatsSnapshot?.docs.find(
                (chat) =>
                    chat.data().users.find((user) => user === recipientEmail)?.length > 0
            );

        if (EmailValidator.validate(prompt) === true) {
            if (prompt === user?.email) {
                alert("You cannot chat with yourself!")
            } else {
                if (EmailValidator.validate(prompt) && !chatAlreadyExist(prompt) && prompt !== user?.email) {
                    db.collection("chats").add({
                        users: [user?.email, prompt],
                    });
                } else {
                    alert(`\"${prompt}\" already exists`)
                }

            }
        } else {
            alert(`\"${prompt}\" is an invalid email format!`)
        }

        setPrompt("")
        setIsOpen(false)
    }

    return (
        <SidebarComponent style={{ backgroundColor: "#F8F8F8" }}>
            {/* Top of Sidebar */}
            <SidebarTopPart className={"bg-gray-200 flex items-center p-5"}>
                <Avatar className={"cursor-pointer"} onClick={handleClick} src={user?.photoURL} />
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={ViewAccountDetails}><AccountCircle className={"mr-2"} /> Accout Details</MenuItem>
                    <MenuItem onClick={signOut}><ExitToAppOutlined className={"mr-2"} /> Sign Out</MenuItem>
                </Menu>
                <div style={{
                    width: "92.7%",
                    justifyContent: "flex-end",
                }} className={"flex flex-1 items-center text-gray-500 "}>
                    <IconButton type="button"
                        onClick={openModal}
                        className={"focus:outline-none"}>
                        <Chat />
                    </IconButton>
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog
                            as="div"
                            className="absolute inset-0 z-10 overflow-y-auto"
                            onClose={closeModal}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Dialog.Overlay className="fixed inset-0" />
                                </Transition.Child>
                                <span
                                    className="inline-block h-screen align-middle"
                                    aria-hidden="true"
                                >
                                    &#8203;
                                </span>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Enter an email to create a Chat!
                                        </Dialog.Title>
                                        <form action="">
                                            <input
                                                value={prompt}
                                                onChange={e => setPrompt(e.target.value)}
                                                placeholder={"Email"}
                                                className={"my-5 focus:outline-none text-gray-500 p-2 rounded-lg w-full bg-gray-100"}
                                            />
                                            <div className="text-right">
                                                <button
                                                    disabled={!prompt}
                                                    onClick={createChat}
                                                    type="submit"
                                                    className={`active:text-whatsapp_green-light active:border-whatsapp_green-light active:bg-white inline-flex justify-center px-4 py-2 text-sm font-medium text-white ${!prompt ? "bg-gray-300 cursor-auto" : "cursor-pointer bg-whatsapp_green-light"} border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500`}
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>

                </div>
            </SidebarTopPart>
            {/* Chat List */}
            <div style={{ height: "87.5vh" }} className={"removeScroller overflow-scroll"}>
                {chatsSnapshot?.docs.map((chat) => (
                    <SidebarChat key={chat.id} id={chat.id} users={chat.data().users} />
                ))}
            </div>
        </SidebarComponent>
    )
}

export default Sidebar

const SidebarComponent = styled.div`
flex: 0.45;
height: 100vh;
width: 300px;
`;

const SidebarTopPart = styled.div`
position: sticky;
z-index: 100;
top: 0;
display: flex;
align-items: center;
`;


