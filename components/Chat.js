import React, { useEffect, useState } from 'react';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
	// Name to display on the States bar and
	// Chat Background Color vuleus from the start sceen
	const { name, chatBackgroundColor } = route.params;

	// State used to hold the message Send
	const [messages, setMessages] = useState([]);

	// Displays massages at the start of the application
	useEffect(() => {
		navigation.setOptions({ title: name });
		setMessages([
			{
				_id: 1,
				text: 'Hello developer',
				createdAt: new Date(),
				user: {
					_id: 2,
					name: 'React Native',
					avatar: 'https://placeimg.com/140/140/any',
				},
			},
			{
				_id: 2,
				text: 'This is a system message',
				createdAt: new Date(),
				system: true,
			},
		]);
	}, []);

	const onSend = (newMessages) => {
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, newMessages)
		);
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
					_id: 1,
				}}
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
