import { PublicMessageInterface } from '@fluffy-fiesta/interfaces';
import React, { Component } from 'react';
import './chat-message.scss';

type Props = {
  message: PublicMessageInterface;
  own: boolean;
};
export default class ChatMessage extends Component<Props, any> {
  override render() {
    const { own, message } = this.props;
    const { text, date, username, clientId } = message;

    let dateString = new Date(date).toTimeString().slice(0, 5);

    const ONE_MINUTE = 60 * 1000;
    if (new Date().getTime() - new Date(date).getTime() < ONE_MINUTE) {
      dateString = 'Just now';
    }

    return (
      <div className={`${own ? 'message_right' : 'message_left'}`}>
        <div>{text}</div>
        <div className="chat_date">{dateString}</div>
      </div>
    );
  }
}
