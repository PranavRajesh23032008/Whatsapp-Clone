import { Avatar, Menu, MenuItem, IconButton } from "@material-ui/core"
import { auth } from '../firebase'
import db from '../firebase'
import styled from "styled-components"
import { AccountCircle, Brightness4, Brightness7, Chat, ExitToAppOutlined } from "@material-ui/icons"
import SidebarChat from './SidebarChat'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import * as EmailValidator from 'email-validator';
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth"
import useDarkMode from "../useDarkMode";

const Sidebar = () => {
    const [colorTheme, setTheme] = useDarkMode();
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
        router.push("/")
        auth.signOut()
    }

    function closeModal() {
        setIsOpen(false)
        setPrompt("")
    }

    function openModal() {
        setIsOpen(true)
    }
    if (colorTheme === "dark") {
        document.body.style.backgroundColor = "#fff";
      } else {
        document.body.style.backgroundColor = "#555B63";          
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
        <SidebarComponent className={"sm:w-80 bg-gray-100 dark:bg-gray-600"}>
        
            <SidebarTopPart className={"dark:border-gray-800 dark:border-r bg-gray-200 dark:bg-gray-700 flex items-center p-5"}>
                <Avatar className={"cursor-pointer"} onClick={handleClick} src={user?.photoURL} />

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={ViewAccountDetails} ><AccountCircle className={"mr-2"} /> Accout Details</MenuItem>
                    <MenuItem onClick={signOut} ><ExitToAppOutlined className={"mr-2"} /> Sign Out</MenuItem>
                </Menu>
                <div style={{
                    width: "92.7%",
                    justifyContent: "flex-end",
                }} className={"flex flex-1 items-center text-gray-500 "}>
                    <IconButton type="button"
                        onClick={openModal}
                        className={"focus:outline-none dark:text-gray-300"}>
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
                                    <div className="dark:text-white dark:bg-gray-600  inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                        >
                                            Enter an email to create a Chat!
                                        </Dialog.Title>
                                        <form action="">
                                            <input
                                                value={prompt}
                                                onChange={e => setPrompt(e.target.value)}
                                                placeholder={"Email"}
                                                className={"dark:bg-gray-700 dark:text-white my-5 focus:outline-none text-gray-500 p-2 rounded-lg w-full bg-gray-100"}
                                            />
                                            <div className="text-right">
                                                <button
                                                    disabled={!prompt}
                                                    onClick={createChat}
                                                    type="submit"
                                                    className={`active:text-whatsapp_gray-light active:border- active:bg-white inline-flex justify-center px-4 py-2 text-sm font-medium text-white ${!prompt ? "bg-gray-300 cursor-not-allowed" : "cursor-pointer dark:bg-gray-700 bg-whatsapp_green-light"} border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500`}
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
                {colorTheme === "light" ? (
                <IconButton className={"focus:outline-none dark:text-gray-300"} onClick={() => setTheme("light")}>
                    <Brightness7/>
                </IconButton>
                ) : (
                <IconButton className={"focus:outline-none ne dark:text-gray-300"} onClick={() => setTheme("dark")}>
                    <Brightness4/>
                </IconButton>
                )}
            </SidebarTopPart>
            {/* Chat List */}
            <div className={"overflow-auto"}>
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
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const SidebarTopPart = styled.div`
position: sticky;
z-index: 100;
top: 0;
display: flex;
align-items: center;
`; 