import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase"
import styled from "styled-components"
import db, { auth } from "../firebase"
import Message from "./Message";
import { ArrowBack, Send } from "@material-ui/icons";

const ChatScreen = ({ name, pic }) => {

  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("")
  const endOfMessagesRef = useRef(null);
  const router = useRouter()
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
        <BackToHome className={"mr-3 cursor-pointer"}>
          < ArrowBack onClick={() => { router.push("/") }} />
        </BackToHome>
        <Avatar src={pic} />
        <HeaderInformation style={{
          marginLeft: 10,
        }} className={"flex-col ml-1"}>
          <p style={{ color: "#515151" }} className={"text-lg font-semibold "}>{name}</p>
        </HeaderInformation>
      </Header>
      {/* Message Field */}
      <MessageContainer className="doodle removeScroller">
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
      <InputContainer className={"bg-gray-100"}>
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
    </Container >
  )
}

export default ChatScreen

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonIcon = styled(IconButton)`
@media (min-width: 769px) {
  display: none;
}
`;

const BackToHome = styled.div`
@media (min-width: 769px) {
  display: none;
}
`;

const Header = styled.div`
  position: sticky;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 15px;
  height: 80px;
  align-items: center;
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
padding: 30px;

min-height: 90vh;
  overflow: scroll
`;

const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color: #f2f2f2;
z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  padding: 25px;
  background-color: transparent
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

