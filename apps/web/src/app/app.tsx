// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Chat from 'libs/components/src/lib/chat/chat';
import ChatMessage from 'libs/components/src/lib/chat-message/chat-message';
import Cha from 'libs/components/src/lib/components';
import styles from './app.module.scss';

export function App() {
  return (
    <div className="container">
      <Chat></Chat>
    </div>
  );
}

export default App;
