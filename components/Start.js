import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Start = ({ navigation }) => {
	return (
		<View>
			<Text>Start</Text>
			<Button
				title="Go to Chat"
				onPress={() => navigation.navigate('Chat')}
			/>
		</View>
	);
};

export default Start;

const styles = StyleSheet.create({});
