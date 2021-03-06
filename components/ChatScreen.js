import { Avatar, IconButton, CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase"
import styled from "styled-components"
import db, { auth } from "../firebase"
import Message from "./Message";
import { ArrowBack, Send, ArrowDownward, Mood, AttachFile } from "@material-ui/icons";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import useDarkMode from "../useDarkMode"

const ChatScreen = ({ name, pic, lastActive, email }) => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("")
  const [displayState, setDisplayState] = useState(false)
  const [display, setDisplay] = useState("none")
  const endOfMessagesRef = useRef(null);
  const router = useRouter()
  const [pickerTheme, setPickerTheme] = useState("light")
  const [isOpen, setIsOpen] = useState(false)
  const [imageToPost, setImageToPost] = useState(null);
  const filepickerRef = useRef(null);
  const showEmojiPicker = () => {
    setDisplayState(!displayState)
    if (displayState === false) {
      setDisplay("block")
    } else (
      setDisplay("none")
    )
  }
  const selectEmoji = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji)
  }

  const addEmoji = e => {
    let emoji = e.native;
    setMessage(
      message + emoji
    );
  };
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );


  const SmoothScrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };


  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  SmoothScrollToBottom()  
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };
  const send = (e) => {
    e.preventDefault();
    SmoothScrollToBottom()

    db.collection("users").doc(user.email).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: message,
      user: user.email,
    })
    // .then((doc) => {
    //   if (imageToPost) {
    //     const uploadTask = storage
    //       .ref(`messages/${doc.id}`)
    //       .putString(imageToPost, "data_url");

    //     removeImage();

    //     uploadTask.on(
    //       "state_changed",
    //       null,
    //       (error) => {
    //         // ERROR function
    //         console.log(error);
    //       },
    //       () => {
    //         // COMPLETE function
    //         storage
    //           .ref("messages")
    //           .child(doc.id)
    //           .getDownloadURL()
    //           .then((url) => {
    //             db.collection("chats").doc(router.query.id).collection("messages").doc(doc.id).add(
    //               {
    //                 postImage: url,
    //               },
    //               { merge: true }
    //             );
    //           });
    //       }
    //     );
    //   } else {
    //     return null
    //   }
    // });

  inputRef.current.value = "";
  }

  return (
    <Container>
      {/* Header */}
      <Header className={"bg-gray-100 dark:bg-gray-700 dark:text-white"}>
        <ButtonIcon className={"mr-3 focus:outline-none cursor-pointer"}>
          < ArrowBack className={"dark:text-white"} onClick={() => { router.push("/") }} />
        </ButtonIcon>
        <Avatar onClick={openModal} className={"cursor-pointer"} src={pic} />
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
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

              {/* This element is to trick the browser into centering the modal contents. */}
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
                <div className="dark:bg-gray-700 inline-block w-full max-w-md pt-5 px-5 my-8 overflow-hidden justify-content-center text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <div className={"flex"}>
                    <img className={"w-40 h-40 rounded-l-2xl"} src={pic} />
                    <div className={"p-2"}>
                      <div>
                        <span className={"font-bold text-whatsapp_green"}>Name:</span> <span className={"dark:text-white"}>{name}</span>
                        <br />
                        <span className={"font-bold text-whatsapp_green"}>Email:</span><span className={"dark:text-white"}>{email}</span>
                        <br />
                        <span className={"font-bold text-whatsapp_green"}>Last Active:</span> <span className={"dark:text-white"}>{lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" className={"focus:outline-none"} />
                </div>

              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        <HeaderInformation style={{
          marginLeft: 10,
        }} className={"flex-col ml-1"}>
          <p className={"dark:text-white text-lg font-semibold text-gray-900"}>{name}</p>
          <p className={"dark:text-white text-xs text-gray-500"}>{lastActive}</p>

        </HeaderInformation>
        
        <IconButton onClick={() => filepickerRef.current.click()} className={"dark:text-white focus:outline-none"}>
          <input type={"file"} hidden onChange={addImageToPost}
            ref={filepickerRef}/>
          <AttachFile/>
        </IconButton>
        <IconButton className={"dark:text-white focus:outline-none shadow-lg hover:shadow-sm"} onClick={SmoothScrollToBottom}>
          <ArrowDownward />
        </IconButton>
      </Header>
      {/* Message Field */}
      <MessageContainer className="p-3 doodle dark:bg-gray-500">
    
        {messagesSnapshot?.docs.map((message) => (
          <Message userName={name} key={message.id} user={message.data().user} message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }} />

        ))}
        
        <EndOfMessage ref={endOfMessagesRef} />
        <Picker theme={pickerTheme} style={{ 
          display: display,
          position: "absolute",
          bottom: 0,
          marginBottom: 100,
        }} className={""} emoji={"smiley"} title={"Pick an Emoji"} set={'apple'} size={30} onSelect={addEmoji} />
      </MessageContainer>
      
      {/* Input Field */}
      
      <InputContainer className={"bg-gray-100 dark:bg-gray-600 dark:text-white flex items-center"}>
        
        <IconButton onClick={showEmojiPicker} className={"dark:text-white focus:outline-none"}>
          <Mood />
        </IconButton>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder={`Send a message to ${name}`}
        />
        {imageToPost && (
          <div
            className="flex flex-col"
          >
            <img className="h-10 object-contain " src={imageToPost} alt="" />
            <p onClick={removeImage} className="transition duration-150 transform hover:underline cursor-pointer text-xs text-red-500 text-center">Remove</p>
          </div>
        )}
        <IconButton style={{
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        }} className={"ml-2 dark:text-white dark:bg-gray-600 focus:outline-none shadow-lg hover:shadow-sm dark:hover:bg-gray-600"} disabled={!message && !imageToPost} type="submit" onClick={send} >
          <Send />
        </IconButton>
      </InputContainer>
    </ Container>
  )
}

export default ChatScreen

const Container = styled.div`
display: flex;
flex-direction: column;
flex: 0.65;
height: 100vh;
`;

const ButtonIcon = styled(IconButton)`
@media (min-width: 769px) {
  display: none;
}
`;


const Header = styled.div`
  align-items: center;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  background-color: #f5f5f5;
`;

const HeaderInformation = styled.div`
  margin-left: 10px;
  flex: 1;
  > h3 {
    margin-bottom: 2px;
    color: white;
    font-size: 25;
    font-weight: bold;
  }
`;

const MessageContainer = styled.div`
flex: 1;
overflow: auto;
`;

const InputContainer = styled.form`
align-items: center;
padding: 20px;
display: flex;
justify-content: space-between;
background-color: #f5f5f5;

`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  background-color: transparent
`;

const EndOfMessage = styled.div``;