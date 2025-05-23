import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react';
import BG from '../assets/images/bg.jpg';
import { deviceHeight, deviceWidth } from '../constant/Scaling';

const Wrapper = ({ children, style }) => {
    return (
        <ImageBackground source={BG} resizeMode='cover' style={styles.container}>
            <SafeAreaView style={[styles.safeArea, { ...style }]}>
                {children}
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        width: deviceWidth,
        height: deviceHeight,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Wrapper