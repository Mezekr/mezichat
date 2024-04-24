import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import {
	disableNetwork,
	enableNetwork,
	getFirestore,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { Alert, LogBox, StyleSheet, Text, View } from 'react-native';
import Chat from './components/Chat';
import Start from './components/Start';

import {
	API_KEY,
	APP_ID,
	AUTH_DOMAIN,
	MESSAGING_SENDER_ID,
	PROJECT_ID,
	STORAGE_BUCKET,
} from '@env';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

const Stack = createNativeStackNavigator();

const App = () => {
	//State that represents the network connectivity status
	const connectionStatus = NetInfo.useNetInfo();

	// Displays an alert popup if connection is lost and
	// Disables attempts to connect to Firestore DB
	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert('Connection Lost!');
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: API_KEY,
		authDomain: AUTH_DOMAIN,
		projectId: PROJECT_ID,
		storageBucket: STORAGE_BUCKET,
		messagingSenderId: MESSAGING_SENDER_ID,
		appId: APP_ID,
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Start">
				<Stack.Screen
					name="Start"
					component={Start}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="Chat">
					{(props) => (
						<Chat
							db={db}
							// Pass connection status to chat component
							isConnected={connectionStatus.isConnected}
							{...props}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default App;
