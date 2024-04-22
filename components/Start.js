import { getAuth, signInAnonymously } from 'firebase/auth';
import React, { useState } from 'react';
import {
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import BackgroundImage from '../assets/BackgroundImage.png';
import userIcon from '../assets/userIcon.png';

const Start = ({ navigation }) => {
	const auth = getAuth();
	// State to hold the name input value
	const [name, setName] = useState('');
	// State to hold the chosen Chat Screen background color
	const [chatBackgroundColor, setChatBackgroundColor] = useState('');

	// Handles the anonymous user sign in
	const signInUser = () => {
		signInAnonymously(auth)
			.then((result) => {
				navigation.navigate('Chat', {
					userID: result.user.uid,
					name: name,
					chatBackgroundColor: chatBackgroundColor,
				});
				Alert.alert('Signed in Successfully!');
			})
			.catch((error) => {
				Alert.alert('Unable to sign in, try later again.');
			});
	};

	return (
		<ImageBackground
			source={BackgroundImage}
			style={styles.BgImage}
			resizeMode="cover"
		>
			<Text style={styles.appTitle}>Mezi Chat</Text>
			<View style={styles.card}>
				<View style={styles.inputContainer}>
					<Image
						source={userIcon}
						style={styles.userIcon}
						resizeMode="contain"
					></Image>
					<TextInput
						style={styles.input}
						placeholder="Your Name"
						value={name}
						onChangeText={setName}
					/>
				</View>
				<View style={styles.colorsBoxContainer}>
					<Text style={styles.colorsBoxContainerLabel}>
						Choose background color
					</Text>
					<View style={styles.colorButtonsContainer}>
						<TouchableOpacity
							style={[
								styles.colorButton,
								{ backgroundColor: '#090C08' },
							]}
							onPress={() => setChatBackgroundColor('#090C08')}
						></TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.colorButton,
								{ backgroundColor: '#474056' },
							]}
							onPress={() => setChatBackgroundColor('#474056')}
						></TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.colorButton,
								{ backgroundColor: '#8A95A5' },
							]}
							onPress={() => setChatBackgroundColor('#8A95A5')}
						></TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.colorButton,
								{ backgroundColor: '#B9C6AE' },
							]}
							onPress={() => setChatBackgroundColor('#B9C6AE')}
						></TouchableOpacity>
					</View>
				</View>
				<TouchableOpacity
					style={styles.customeBtn}
					accessible={true}
					accessibilityLabel="Start chatting"
					accessibilityHint="Navigates to the chat screen to start \
							chatting and send a picture or your geolocation."
					accessibilityRole="button"
					onPress={signInUser}
					activeOpacity={0.7}
				>
					<Text style={styles.text}>Start chatting</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	BgImage: {
		flex: 1,
		justifyContent: 'space-between',
		alignContent: 'center',
		alignItems: 'center',
	},
	card: {
		width: '88%',
		height: '44%',
		backgroundColor: 'white',
		alignItems: 'center',
		marginBottom: 20,
		justifyContent: 'space-evenly',
		borderRadius: 4,
	},
	appTitle: {
		flex: 1,
		fontSize: 45,
		fontWeight: '600',
		color: '#ffffff',
		justifyContent: 'center',
		marginTop: 100,
	},
	colorsBoxContainer: {
		width: '88%',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	colorsBoxContainerLabel: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		textAlign: 'left',
		alignSelf: 'flex-start',
		marginBottom: 10,
	},

	colorButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		gap: 20,
	},
	colorButton: {
		width: 60,
		height: 60,
		borderWidth: 1,
		borderRadius: 30,
		borderColor: '#3887ff',
	},
	customeBtn: {
		width: '88%',
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#757083',
		padding: 10,
		borderRadius: 5,
	},
	text: {
		fontSize: 16,
		fontWeight: '600',
		color: '#ffffff',
	},
	inputContainer: {
		// flex: 1,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#b4b4b4',
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 50,
		width: '80%',
		height: 40,
		padding: 5,
	},
	userIcon: {
		width: '10%',
		height: 35,
	},
});

export default Start;
