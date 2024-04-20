import React, { useEffect, useState } from 'react';
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import sendMessage from '../assets/sendMessage.png';

const Chat = ({ route, navigation }) => {
	const { name, chatBackgroundColor } = route.params;

	const [text, setText] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		navigation.setOptions({ title: name });
	}, []);

	const handlePress = () => {
		setMessage(text);
		setText('');
	};

	return (
		// <SafeAreaView>
		<ScrollView style={{ backgroundColor: chatBackgroundColor }}>
			<View style={styles.chatContainer}>
				<Text style={styles.textDisplay}>{message}</Text>

				<View style={styles.inputContainer}>
					<TextInput
						style={styles.chatTextInput}
						value={text}
						onChangeText={setText}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={handlePress}
					>
						<Image
							style={styles.sendMessageIcon}
							source={sendMessage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
		// </SafeAreaView>
	);
};

export default Chat;

const styles = StyleSheet.create({
	chatContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		padding: 10,
	},
	textDisplay: {
		flex: 0.8,
		height: 100,
		lineHeight: 30,
	},
	inputContainer: {
		flex: 0.2,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#b4b4b4',
		alignItems: 'center',
		gap: 5,
	},
	chatTextInput: {
		fontSize: 12,
		fontWeight: '300',
		color: '#757083',
		opacity: 50,
		width: '88%',
		height: 50,
		padding: 4,
		borderWidth: 1,
		borderColor: '#b4b4b4',
	},
	sendMessageIcon: {
		width: 40,
		height: 40,
		padding: 5,
	},
	button: {
		alignItems: 'center',
		width: '10%',
		height: 40,
	},
});
