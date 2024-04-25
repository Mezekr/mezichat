import { useActionSheet } from '@expo/react-native-action-sheet';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomActions = ({
	wrapperStyle,
	iconTextStyle,
	storage,
	onSend,
	userID,
}) => {
	// fetchs Gifted Chat's ActionSheet so that you can add these options to it
	const actionSheet = useActionSheet();

	// Reference to the recording object
	let recordingObject = null;

	useEffect(() => {
		return () => {
			// Recording object gets unloaded from the memory
			if (recordingObject) recordingObject.stopAndUnloadAsync();
		};
	}, []);

	const onActionPress = () => {
		const options = [
			'Select an image from library',
			'Take a photo',
			'Share location',
			'Record a Sound',
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
					case 3:
						startRecording();
						return;
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
			if (!result.canceled) {
				await uploadAndSendImage(result.assets[0].uri);
				let mediaLibraryPermissions =
					await MediaLibrary.requestPermissionsAsync();
				if (mediaLibraryPermissions?.granted)
					await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
			} else Alert.alert("Permissions haven't been granted.");
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

	const getLocation = async () => {
		let permissions = await Location.requestForegroundPermissionsAsync();
		if (permissions?.granted) {
			const location = await Location.getCurrentPositionAsync({});
			if (location) {
				onSend({
					location: {
						longitude: location.coords.longitude,
						latitude: location.coords.latitude,
					},
				});
			} else Alert.alert('Error occurred while fetching location');
		} else Alert.alert("Permissions haven't been granted.");
	};

	const startRecording = async () => {
		try {
			let permissions = await Audio.requestPermissionsAsync();
			if (permissions?.granted) {
				// iOS specific config to allow recording on iPhone devices
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: true,
					playsInSilentModeIOS: true,
				});
				Audio.Recording.createAsync(
					Audio.RecordingOptionsPresets.HIGH_QUALITY
				)
					.then((results) => {
						return results.recording;
					})
					.then((recording) => {
						recordingObject = recording;
						Alert.alert(
							'Recording...',
							undefined,
							[
								{
									text: 'Cancel',
									onPress: () => {
										stopRecording();
									},
								},
								{
									text: 'Stop and Send',
									onPress: () => {
										sendRecordedSound();
									},
								},
							],
							{ cancelable: false }
						);
					});
			}
		} catch (err) {
			Alert.alert('Failed to record!');
		}
	};

	const stopRecording = async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: false,
		});
		await recordingObject.stopAndUnloadAsync();
	};

	const sendRecordedSound = async () => {
		await stopRecording();
		const uniqueRefString = generateReference(recordingObject.getURI());
		const newUploadRef = ref(storage, uniqueRefString);
		const response = await fetch(recordingObject.getURI());
		const blob = await response.blob();
		uploadBytes(newUploadRef, blob).then(async (snapshot) => {
			const soundURL = await getDownloadURL(snapshot.ref);
			onSend({ audio: soundURL });
		});
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
