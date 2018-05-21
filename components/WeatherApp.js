import React, { Component } from 'react';
import axios from 'axios';
import { View, Text, Dimensions } from 'react-native';
import { Button, Input, Spinner } from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;

class WeatherApp extends Component {
	state = {
		city: '',
		temp: '',
		errorStatus: false,
		errorMessage: '',
		loading: false,
		term: '',
		weather: ''
	}

	onChangeCity = (city) => {
		this.setState({ city, errorStatus: false });
	}

	onSubmit = async () => {
		if (this.state.city.length === 0) {
			this.setState({ errorStatus: true, errorMessage: 'Type something...' });
			return false;
		}
		this.setState({ loading: true, errorStatus: false });
		try {
			const url = `http://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&units=metric&appid=ef2e1ce16ede8eb46f43d445d930f94d`;
			const { data } = await axios.get(url);
			this.setState({ 
				loading: false, 
				temp: data.main.temp, 
				term: data.name, 
				weather: data.weather[0].description 
			});
		} catch (e) {
			console.log(e);
			this.setState({ 
				errorStatus: true, 
				errorMessage: 'No such city or internet connection', 
				loading: false 
			});
		}
	}

	renderWeather = () => {
		if (this.state.temp.length !== 0) {
			return (
				<View style={styles.weatherContainer}>
					<Text style={styles.weatherLabelText}>Now in {this.state.term}:</Text>
					<Text style={styles.weatherText}>{'\n'}{this.state.temp } °C, {this.state.weather}.</Text>
				</View>
			);
		}
	}

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner />;
		}
		return <Button onPress={() => this.onSubmit()}>Get weather!</Button>;
	}

	renderError = () => {
		if (this.state.errorStatus) {
			return (
				<View style={styles.errorMessageContainer}>
					<Text style={styles.errorMessageText}>Error: {this.state.errorMessage}</Text>
				</View>
			);
		}
	}

	render() {
		return (
			<View style={styles.containerStyle}>
				{this.renderError()}
				<View style={styles.weaterBlock}>
					<Input 
						label='Enter city:'
						placeholder="Kyiv"
						onChangeText={city => this.onChangeCity(city)}
						value={this.state.city}
					/>				
				{this.renderButton()}
				{this.renderWeather()}
				</View>
			</View>
		);
	}
}

const styles = {
	containerStyle: {
		flex: 1,
		marginTop: 22,
		paddingTop: 140
	},
	weatherContainer: {
		margin: 10,
	},
	weatherLabelText: {
		fontSize: 18
	},
	weatherText: {
		fontSize: 22,
		color: '#007aff'
	},
	errorMessageContainer: {
		position: 'absolute',
		top: 70,
		width: SCREEN_WIDTH,
		alignItems: 'center'
	},
	errorMessageText: {
		color: 'red',
		fontSize: 16,
	}
};

export default WeatherApp;
