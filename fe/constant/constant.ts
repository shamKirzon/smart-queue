import Constants from 'expo-constants';

const manifest = Constants.manifest ?? Constants.expoConfig;
const debuggerHost = manifest?.hostUri ?? '';
const PORT = 5000;

let WS_URL = '';
if (typeof window !== "undefined" && window.location && window.location.hostname) {
  WS_URL = `ws://${window.location.hostname}:5000`;
} else if (debuggerHost) {
  const ip = debuggerHost.split(':')[0];
  WS_URL = `ws://${ip}:${PORT}`;
} else {
  WS_URL = `ws://localhost:${PORT}`;
}

export default WS_URL;


//if nagkaproblema eto ung dating gawa mo
/** 
import Constants from 'expo-constants';

const manifest = Constants.manifest ?? Constants.expoConfig;
const debuggerHost = manifest?.hostUri ?? ''; 
const PORT = 5000;

const ip = debuggerHost.split(':')[0];
const WS_URL = `ws://${ip}:${PORT}`;

export default WS_URL;
*/