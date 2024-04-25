import { useActionSheet } from '@expo/react-native-action-sheet';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomActions = ({ wrapperStyle, iconTextStyle }) => {
	// fetchs Gifted Chat's ActionSheet so that you can add these options to it
	const actionSheet = useActionSheet();

	const onActionPress = () => {
		const options = [
			'Choose Image From Library',
			'Take Picture',
			'Send Location',
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
