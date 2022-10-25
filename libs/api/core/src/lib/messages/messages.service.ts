import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [];
  clientToUser = {};

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const { date, text, username } = createMessageDto;
    const message = new Message();
    message.date = date;
    message.text = text;
    message.username = username;
    message.clientId = clientId;
    message.id = this.messages.length;

    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  join(username: string, clientId: string) {
    this.clientToUser[clientId] = username;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  disconnectClient(id: string) {
    delete this.clientToUser[id];
  }
}
