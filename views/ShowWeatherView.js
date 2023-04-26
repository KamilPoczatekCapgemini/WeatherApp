import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = '4ce2cc863616c3b1f0b6ff3b1935d633';
const NUM_PRED = 5;

const ShowWeatherView = () => {
    const [locationData, setLocationData] = useState(null);
    const [weatherData, setWeatherData] = useState({ current: null, forecast: null });

    useEffect(() => {
        getLocationAsync();
    }, []);

    useEffect(() => {
        getWeatherAsync();
    }, [locationData]);

    const getLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status == 'granted') {
            setLocationData(await Location.getCurrentPositionAsync({}));
            console.log('Location was loaded succesfully');
        } else {
            console.log('Permission to access location was denied');
        }
    }

    const getWeatherAsync = async () => {
        if (locationData) {
            const { latitude, longitude } = locationData.coords;

            const API_URL1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            const API_URL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&cnt=${NUM_PRED}`

            const currentResponse = await axios.get(API_URL1);
            const forecastResponse = await axios.get(API_URL2);

            setWeatherData({ current: currentResponse.data, forecast: forecastResponse.data.list });
        }
    }

    const handleRefresh = async () => {
        setLocationData(null);
        getLocationAsync();
    }

    const renderForecastWeatherList = () => {
        if (weatherData.forecast) {
            return weatherData.forecast.map((item, index) => (
                <View key={index}>
                    <Text style={styles.forecast}>{item.dt_txt} {item.main.temp}°C</Text>
                </View>
            ));
        }
    };

    if (locationData && weatherData.current && weatherData.forecast) {
        return (
            <View style={styles.container}>
                <Text style={styles.location}>{weatherData.current.name}</Text>
                <Text style={styles.temperature}>{weatherData.current.main.temp}°C</Text>
                <Text style={styles.description}>{weatherData.current.weather[0].description}</Text>
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                    <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
                <ScrollView >
                    {renderForecastWeatherList()}
                </ScrollView >
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading...</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loading: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    location: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 26,
    },

    temperature: {
        fontSize: 48,
        marginBottom: 16,
    },

    description: {
        fontSize: 18,
        marginBottom: 16,
    },

    refreshButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },

    refreshText: {
        fontSize: 18,
        color: '#fff',
    },

    forecast: {
        fontSize: 18,
        marginBottom: 16,
    },
});

export default ShowWeatherView;