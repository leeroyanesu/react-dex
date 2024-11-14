/* ./userSession.js */
import { AppConfig, UserSession } from '@stacks/connect';
import { isTestnet } from '../Constants';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig }); // we will use this export from other files
export const getAddress = () => {
    if (isTestnet) {
      return userSession.loadUserData().profile.stxAddress.testnet;
    } else {
      return userSession.loadUserData().profile.stxAddress.mainnet;
    }
  }