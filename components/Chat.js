import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
	// Name to display on the States bar and
	// Chat Background Color vuleus from the start sceen
	const { userID, name, chatBackgroundColor } = route.params;

	// State used to hold the message Send
	const [messages, setMessages] = useState([]);

	let soundObject = null;

	let unsubChatMessages;

	useEffect(() => {
		navigation.setOptions({ title: name });

		// If online, loads from Firebase, otherwise loads from local storage
		if (isConnected === true) {
			// unregister current onSnapshot() listener to avoid registering
			// multiple listeners when useEffect code is re-executed.
			if (unsubChatMessages) unsubChatMessages();
			unsubChatMessages = null;

			// Get user with specific ID
			const queryUser = query(
				collection(db, 'chatmessages'),
				orderBy('createdAt', 'desc')
			);

			// Real-Time Firestore Data Synchronization/reading
			unsubChatMessages = onSnapshot(queryUser, (docsSnapshot) => {
				let newMessages = [];
				docsSnapshot.forEach((doc) => {
					newMessages.push({
						id: doc.id,
						...doc.data(),
						createdAt: new Date(doc.data().createdAt.toMillis()),
					});
				});
				cacheChatMessages(newMessages);
				setMessages(newMessages);
			});
		} else loadCachedMessages();

		// Clean up code to avoid memory leaks
		return () => {
			if (unsubChatMessages) unsubChatMessages();
			// Unload sound from memory when chat component unmounts
			if (soundObject) soundObject.unloadAsync();
		};
	}, [isConnected]);

	const cacheChatMessages = async (messagesToCache) => {
		try {
			await AsyncStorage.setItem(
				'localChatMessages',
				JSON.stringify(messagesToCache)
			);
		} catch (error) {
			console.log(error.message);
		}
	};

	const loadCachedMessages = async () => {
		const cachedChatMessages =
			(await AsyncStorage.getItem('localChatMessages')) || [];
		setMessages(JSON.parse(cachedChatMessages));
	};

	//Writing Data in Firestore Database
	const onSend = (newMessages) => {
		addDoc(collection(db, 'chatmessages'), newMessages[0]);
	};

	// Change the bubble background colour based on the chat background colour
	const bubbleBgColor =
		chatBackgroundColor === '#090C08' ? '#707070' : '#000';

	// Customize the GiftedChat message bubble component
	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: bubbleBgColor,
					},
					left: {
						backgroundColor: '#FFF',
					},
				}}
			/>
		);
	};

	const renderInputToolbar = (props) => {
		if (isConnected)
			return (
				<InputToolbar {...props}>
					<Ionicons
						name="send-sharp"
						size={36}
						color="#00C418"
						style={{ padding: 5 }}
					></Ionicons>
				</InputToolbar>
			);
		else return null;
	};

	const renderCustomActions = (props) => {
		return <CustomActions storage={storage} userID={userID} {...props} />;
	};

	// Renders Geolaction data
	const renderCustomView = (props) => {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{
						width: 150,
						height: 100,
						borderRadius: 13,
						margin: 5,
					}}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	};

	// Renders a message bubble that contains a button to play
	const renderAudioBubble = (props) => {
		return (
			<View {...props}>
				<TouchableOpacity
					style={{
						backgroundColor: '#f2f5e5',
						borderRadius: 10,
						margin: 5,
					}}
					onPress={async () => {
						const { sound } = await Audio.Sound.createAsync({
							uri: props.currentMessage.audio,
						});
						soundObject = sound;
						await sound.playAsync();
					}}
				>
					<Ionicons
						name="play-circle-sharp"
						size={48}
						style={{
							textAlign: 'center',
							color: 'black',
							padding: 5,
						}}
					></Ionicons>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View
			style={[styles.container, { backgroundColor: chatBackgroundColor }]}
		>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				renderInputToolbar={renderInputToolbar}
				onSend={(messages) => onSend(messages)}
				renderActions={renderCustomActions}
				renderCustomView={renderCustomView}
				renderMessageAudio={renderAudioBubble}
				user={{
					_id: userID,
					name: name,
				}}
				alwaysShowSend
				showUserAvatar
				scrollToBottom
			/>
			{Platform.OS === 'android' ? (
				<KeyboardAvoidingView behavior="height" />
			) : (
				<KeyboardAvoidingView behavior="padding" />
			)}
		</View>
	);
};

export default Chat;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
