export interface PublicMessageInterface {
  username: string;
  clientId: string;
  date: string;
  text: string;
}
export interface MessageInterface extends PublicMessageInterface {
  id: number;
}
