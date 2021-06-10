import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase"
import styled from "styled-components"
import db, { auth } from "../firebase"
import Message from "./Message";
import { ArrowBack, Send, EmojiEmotionsOutlined } from "@material-ui/icons";
import Picker from "emoji-picker-react"

const ChatScreen = ({ name, pic, lastActive }) => {

  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("")
  const endOfMessagesRef = useRef(null);
  const router = useRouter()
  const [emojiPickerState, SetEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const selectEmoji = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji)
  }

  function triggerPicker(event) {
    event.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  }
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );


  const ScrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const send = (e) => {
    e.preventDefault();
    SetEmojiPicker(!emojiPickerState);

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
      photoURL: user.photoURL,
    });

    setMessage("")
    ScrollToBottom();
  }
  return (
    <Container>
      {/* Header */}
      <Header className={"bg-gray-100"}>
        <BackToHome className={"mr-3 focus:outline-none cursor-pointer"}>
          < ArrowBack onClick={() => { router.push("/") }} />
        </BackToHome>
        <Avatar src={pic} />
        <HeaderInformation style={{
          marginLeft: 10,
        }} className={"flex-col ml-1"}>
          <p style={{ color: "#515151" }} className={"text-lg font-semibold "}>{name}</p>
          <p className={"text-xs text-gray-500"}>{lastActive}</p>
        </HeaderInformation>
      </Header>
      {/* Message Field */}
      <MessageContainer className="doodle removeScroller p-3 ">
        {ScrollToBottom}
        {messagesSnapshot?.docs.map((message) => (
          <Message key={message.id} user={message.data().user} message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }} />
        ))}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      {/* Input Field */}
      <EmojiPicker className={"absolute"}>
        <Picker
          title="Pick your emoji…"
          emoji="point_up"
          onEmojiClick={selectEmoji}
        />
      </EmojiPicker>

      <InputContainer className={"bg-gray-100"}>
        <IconButton onClick={triggerPicker} className={"focus:outline-none"}>
          <EmojiEmotionsOutlined />
        </IconButton>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder={`Send a message to ${name}`}
        />

        <ButtonIcon hidden={false} disabled={!message} type="submit" onClick={send} >
          <Send />
        </ButtonIcon>
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

const BackToHome = styled(IconButton)`
@media (min-width: 769px) {
  display: none;
}
`;
const EmojiPicker = styled.div`
  margin-top: 42vh;
`;
const Header = styled.div`
  align-items: center;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
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
overflow: scroll;
`;

const InputContainer = styled.form`
position: sticky;
  z-index: 100;
  top: 0;
display: flex;
align-items: center;
padding: 15px;
background-color: #f2f2f2;
`;

const Input = styled.input`

  flex: 1;
  outline: 0;
  border: none;
  background-color: transparent
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;