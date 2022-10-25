import React, { Component } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import './chat-header.scss';

type Props = {
  chatName: string;
  nbrNotifications: number;
};
export default class ChatHeader extends Component<Props> {
  override render() {
    return (
      <div className="header">
        <span className="back-button">
          <AiOutlineArrowLeft />
          <div className="spacer"></div>
          All messages (
          <span className="nbr-messages">{this.props.nbrNotifications}</span>)
        </span>
        <span className="info">
          <h1>{this.props.chatName}</h1>
        </span>
      </div>
    );
  }
}
