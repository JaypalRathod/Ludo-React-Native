import { StyleSheet, Animated, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { deviceHeight, deviceWidth } from '../constant/Scaling'
import Wrapper from '../components/Wrapper'
import { prepareNavigation, resetAndNavigate } from '../helpers/NavigationUtils';
import Logo from '../assets/images/logo.png';

const SplashScreen = () => {

  const [isStop] = useState(false);
  const scale = new Animated.Value(1);

  useEffect(() => {
    prepareNavigation();
    setTimeout(() => {
      resetAndNavigate('HomeScreen');
    }, 1500);
  }, [])

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (!isStop) {
      breathingAnimation.start();
    }

    return () => {
      breathingAnimation.stop();
    }
  }, [isStop]);

  return (
    <Wrapper>
      <Animated.View style={[styles.imgContainer, { transform: [{ scale }] }]}>
        <Image source={Logo} style={styles.img} />
      </Animated.View>

      <ActivityIndicator size='small' color='white' />
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  imgContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight * 0.7,
    width: deviceWidth * 0.6,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
})

export default SplashScreen