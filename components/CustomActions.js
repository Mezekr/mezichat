import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomActions = ({
	wrapperStyle,
	iconTextStyle,
	storage,
	onSend,
	userID,
}) => {
	// fetchs Gifted Chat's ActionSheet so that you can add these options to it
	const actionSheet = useActionSheet();

	const onActionPress = () => {
		const options = [
			'Select an image from library',
			'Take a photo',
			'Share location',
			'Cancel',
		];
		const cancelButtonIndex = options.length - 1;
		actionSheet.showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						pickImage();
						return;
					case 1:
						takePhoto();
						return;
					case 2:
						getLocation();
					default:
				}
			}
		);
	};

	const pickImage = async () => {
		let permissions =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissions?.granted) {
			let result = await ImagePicker.launchImageLibraryAsync();
			if (!result.canceled)
				await uploadAndSendImage(result.assets[0].uri);
			else Alert.alert("Permissions haven't been granted.");
		}
	};
	const takePhoto = async () => {
		let permissions = await ImagePicker.requestCameraPermissionsAsync();
		if (permissions?.granted) {
			let result = await ImagePicker.launchCameraAsync();
			if (!result.canceled)
				await uploadAndSendImage(result.assets[0].uri);
			else Alert.alert("Permissions haven't been granted.");
		}
	};

	// Uploads the image to Clould Firestore and
	// Sends the image to gitedchat props to render as a message
	const uploadAndSendImage = async (imageURI) => {
		const uniqueRefString = generateReference(imageURI);
		const newUploadRef = ref(storage, uniqueRefString);
		const response = await fetch(imageURI);
		const blob = await response.blob();
		uploadBytes(newUploadRef, blob).then(async (snapshot) => {
			const imageURL = await getDownloadURL(snapshot.ref);
			onSend({ image: imageURL });
		});
	};

	// Generates a unique string reference for the image being uploaded
	const generateReference = (uri) => {
		const timeStamp = new Date().getTime();
		const imageName = uri.split('/')[uri.split('/').length - 1];
		return `${userID}-${timeStamp}-${imageName}`;
	};

	return (
		<TouchableOpacity style={styles.container} onPress={onActionPress}>
			<View style={[styles.wrapper, wrapperStyle]}>
				<Text style={[styles.iconText, iconTextStyle]}> + </Text>
			</View>
		</TouchableOpacity>
	);
};

export default CustomActions;

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
		alignItems: 'center',
	},
	iconText: {
		color: '#515A6E',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center',
	},
});
