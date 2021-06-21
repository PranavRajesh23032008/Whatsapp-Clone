import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import styled from "styled-components";
import moment from "moment";

function Message({ user, message, userName }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  return (
    <div>
      <TypeOfMessage>
        <p>{userName}</p>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </div>
  );
}

export default Message;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
`;

const Sender = styled(MessageElement)`
  background-color: #E1FFC7;
  word-break: break-word;
  margin-left: auto;
  > p {
    display: none;
  }
`;

const Reciever = styled(MessageElement)`
  background-color: #fff;
  word-break: break-word;
  > p {
    color: gray;
    font-size:13px;
    margin-bottom: 1px;
    color: #11887A;
  }
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
