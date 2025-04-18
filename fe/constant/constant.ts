import Constants from 'expo-constants';

const manifest = Constants.manifest ?? Constants.expoConfig;
const debuggerHost = manifest?.hostUri ?? ''; 
const PORT = 5000;

const ip = debuggerHost.split(':')[0];
const WS_URL = `ws://${ip}:${PORT}`;

export default WS_URL;
