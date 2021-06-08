import React from "react";
import db, { auth } from "../../firebase";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore"
import styled from "styled-components"

const Chat = ({ chat, messages }) => {
    const [user] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Head>
                {recipient ? (
                    <title>You are chatting with "{recipient?.name}"</title>
                ) : (
                    <title>You are chatting with "{recipientEmail}"</title>
                )}
            </Head>
            <SidebarChatSection>
                <Sidebar />
            </SidebarChatSection>
            <ChatContainer>
            <ChatScreen 
                pic={recipient?.photoURL}
                name={recipient?.name}
            />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {

    const messagesRes = await db.collection("chats").doc(context.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .get();

    const messages = messagesRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((messages) => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime(),
        }));

    const chatRes = await db.collection("chats").doc(context.query.id).get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    };

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        },
    };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  height: 100vh;
`;

const SidebarChatSection = styled.div`
    @media (max-width: 768px) {
        display: none;
    };
`;
