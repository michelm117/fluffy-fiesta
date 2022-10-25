import React, { Component } from 'react';
import ChatMessage from '../chat-message/chat-message';
import './chat.scss';
import { AiOutlineSend } from 'react-icons/ai';
import {
  MessageInterface,
  PublicMessageInterface,
} from '@fluffy-fiesta/interfaces';
import ChatHeader from '../chat-header/chat-header';
import { io } from 'socket.io-client';

type ChatProps = {};
type ChatState = {
  username: string;
  messages: MessageInterface[];
  input: string;
};

export default class Chat extends Component<ChatProps, ChatState> {
  messageInputRef!: React.RefObject<HTMLInputElement>;
  socket = io('localhost:3333');
  joined = false;
  username = 'unrealWombat';
  clientId!: string;

  constructor(props: ChatProps) {
    super(props);
    this.messageInputRef = React.createRef();

    const username = this.username;

    let messages: MessageInterface[] = [];
    this.socket.emit('findAllMessages', {}, (res: MessageInterface[]) => {
      messages = res;
    });

    this.state = {
      input: '',
      username: username,
      messages: messages,
    };
  }

  override componentDidMount() {
    this.join();

    this.socket.on('message', (res: MessageInterface) => {
      console.log('RES', res);

      this.setState({
        messages: [...this.state.messages, res],
      });
    });
  }

  override render() {
    return (
      <div className="container">
        <ChatHeader nbrNotifications={20} chatName={'Public Room'}></ChatHeader>
        <div className="chat">
          <div className="chat__wrapper">{this.renderMessage()}</div>
        </div>
        <div className="input">
          <input
            type="text"
            placeholder="Message"
            onKeyPress={this.sendMessage}
            ref={this.messageInputRef}
          />
          <button onClick={this.sendMessage} className="send-button">
            <AiOutlineSend size={'18px'} />
          </button>
        </div>
      </div>
    );
  }

  join = () => {
    this.socket.emit('join', { username: this.username }, (res: any) => {
      this.joined = true;
      this.clientId = this.socket.id;
    });
  };

  sendMessage = (event: any) => {
    if (event.key === 'Enter' || !event.key) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const messageToSend = this.messageInputRef.current!.value;
      if (!messageToSend) {
        return;
      }

      this.socket.emit(
        'createMessage',
        {
          username: 'wombat',
          date: new Date().toISOString(),
          text: messageToSend,
        },
        () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.messageInputRef.current!.value = '';
        }
      );

      window.scrollTo({ top: 100000000, behavior: 'smooth' });
    }
  };
  renderMessage() {
    const { messages } = this.state;
    return messages.map((message, i) => {
      return (
        <ChatMessage
          key={message.date}
          message={message}
          own={message.clientId === this.clientId ? true : false}
        ></ChatMessage>
      );
    });
  }
}
