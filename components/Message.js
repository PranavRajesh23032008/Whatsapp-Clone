import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import styled from "styled-components";
import moment from "moment";
import Linkify from "react-linkify"
import { MoreVert } from "@material-ui/icons";

function Message({ user, message, userName }) {

  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  return (
    <div>
      <TypeOfMessage>
        <p>{userName}</p>

        <Linkify properties={{ target: '_blank', style: { color: 'red', fontWeight: 'bold' } }}>
          {message.message}
          {/* <span>
            <MoreVert style={{ fontSize: "14px", marginLeft: "auto", marginLeft: "auto" }} />
          </span> */}
        </Linkify>
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : ""}
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

const MessageOptions = styled.div``;

const Sender = styled(MessageElement)`
  background-color: #E1FFC7;
  word-break: break-word;
  margin-left: auto;
  > p {
    display: none;
  };
  >span {
    font-size: 14px;
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
  };
  >span {
    display: none
  }
`;

const Timestamp = styled.h1`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
