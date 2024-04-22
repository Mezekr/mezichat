import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation, db }) => {
	// Name to display on the States bar and
	// Chat Background Color vuleus from the start sceen
	const { userID, name, chatBackgroundColor } = route.params;

	// State used to hold the message Send
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		navigation.setOptions({ title: name });

		// Get user with specific ID
		const queryUser = query(
			collection(db, 'chatmessages'),
			orderBy('createdAt', 'desc')
		);

		// Real-Time Firestore Data Synchronization/reading
		const unsubChatMessages = onSnapshot(queryUser, (docsSnapshot) => {
			let newMessages = [];
			docsSnapshot.forEach((doc) => {
				newMessages.push({
					id: doc.id,
					...doc.data(),
					createdAt: new Date(doc.data().createdAt.toMillis()),
				});
			});
			setMessages(newMessages);
		});

		// Clean up code to avoid memory leaks
		return () => {
			if (unsubChatMessages) unsubChatMessages();
		};
	}, []);

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

	return (
		<View
			style={[styles.container, { backgroundColor: chatBackgroundColor }]}
		>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				onSend={(messages) => onSend(messages)}
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
