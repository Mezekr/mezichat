import { useNetInfo } from '@react-native-community/netinfo';
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

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

const Stack = createNativeStackNavigator();

const App = () => {
	//State that represents the network connectivity status
	const connectionStatus = useNetInfo();

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
		apiKey: 'AIzaSyAvoMwnLUNqchhzI02kLDtH_YE0nuUaucs',
		authDomain: 'mezichatapp.firebaseapp.com',
		projectId: 'mezichatapp',
		storageBucket: 'mezichatapp.appspot.com',
		messagingSenderId: '703795610972',
		appId: '1:703795610972:web:da0c4c89576062459b2d99',
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
					{(props) => <Chat db={db} {...props} />}
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
