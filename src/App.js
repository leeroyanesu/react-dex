import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { Routes, Route } from "react-router-dom";
import { authenticate, showConnect } from '@stacks/connect';
import { getAddress, userSession } from './storage/userSession';
import { appName, appIcon, isTestnet } from "./Constants";


function App() {
  const connect = () =>
    showConnect({
      userSession, // `userSession` from previous step, to access storage
      appDetails: {
        name: appName,
        icon: appIcon,
      },
      onFinish: () => {
        window.location.reload(); // WHEN user confirms pop-up
      },
      onCancel: () => {
        console.log('oops'); // WHEN user cancels/closes pop-up
      },
    });
  return (
    <div className="App">
      <Header connect={connect} isConnected={userSession.isUserSignedIn()} address={(userSession.isUserSignedIn()?getAddress():"")} session={userSession} />
      <div className="mainWindow">
        <Routes>
          <Route
            path="/"
            element={<Swap isConnected={userSession.isUserSignedIn()} address={(userSession.isUserSignedIn()?getAddress():"")} />}
          />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
