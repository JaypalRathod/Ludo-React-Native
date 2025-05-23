import { View, Text, StyleSheet, Image, Alert, Pressable, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import Wrapper from '../components/Wrapper'
import Logo from '../assets/images/logo.png';
import { deviceHeight, deviceWidth } from '../constant/Scaling';
import GradiantButton from '../components/GradiantButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPositions } from '../redux/reducers/gameSelectors';
import { useIsFocused } from '@react-navigation/native';
import { playSound } from '../helpers/SoundUtility';
import SoundPlayer from 'react-native-sound-player';
import { resetGame } from '../redux/reducers/gameSlice';
import { navigate } from '../helpers/NavigationUtils';
import LottieView from 'lottie-react-native';
import witch from '../assets/animation/witch.json';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const whichAnim = useRef(new Animated.Value(-deviceWidth)).current;
  const scaleXAnim = useRef(new Animated.Value(-1)).current;

  const currentPosition = useSelector(selectCurrentPositions)
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      playSound('home')
    }
  }, [isFocused])

  const renderButton = useCallback(
    (title, onPress) =>
      <GradiantButton title={title} onPress={onPress} />, []
  );

  const startGame = async (isNew = false) => {
    SoundPlayer.stop();
    if (isNew) {
      dispatch(resetGame());
    }

    navigate('LudoBoardScreen');
    playSound('game_start');
  }

  const handleNewGamePress = useCallback(() => {
    startGame(true);
  }, [])

  const handleResumePress = useCallback(() => {
    startGame();
  }, [])

  const loopAnimation = () => {
    Animated.loop(
      Animated.sequence([

        Animated.parallel([
          Animated.timing(whichAnim, {
            toValue: deviceWidth * 0.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: -1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(3000),

        Animated.parallel([
          Animated.timing(whichAnim, {
            toValue: deviceWidth * 2,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: -1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(whichAnim, {
            toValue: -deviceWidth * 0.05,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(3000),

        Animated.parallel([
          Animated.timing(whichAnim, {
            toValue: -deviceWidth * 2,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleXAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

      ]),
    ).start();
  }

  useEffect(() => {

    const cleanupAnimation = () => {
      Animated.timing(whichAnim).stop();
      Animated.timing(scaleXAnim).stop();
    }

    loopAnimation();

    return cleanupAnimation;

  }, [whichAnim, scaleXAnim])

  return (
    <Wrapper style={{ justifyContent: 'flex-start' }}>
      <Animated.View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </Animated.View>

      {currentPosition.length !== 0 && renderButton('RESUME', handleResumePress)}

      {renderButton('NEW GAME', handleNewGamePress)}

      {renderButton('VS CPU', () => Alert.alert('Coming soon ! click new game'))}

      {renderButton('2 VS 2', () => Alert.alert('Coming soon ! click new game'))}

      <Animated.View style={[styles.witchContainer, { transform: [{ translateX: whichAnim }, { scaleX: scaleXAnim }] }]}>
        <Pressable onPress={() => {
          const random = Math.floor(Math.random() * 3) + 1;
          playSound(`girl${random}`);
        }}>
          <LottieView
            hardwareAccelerationAndroid
            source={witch}
            autoPlay={true}
            speed={1}
            style={styles.witch}
          />
        </Pressable>
      </Animated.View>

    </Wrapper>
  )
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'container',
  },
  imgContainer: {
    width: deviceWidth * 0.6,
    height: deviceHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    alignSelf: 'center',
  },
  witchContainer: {
    position: 'absolute',
    top: '70%',
    left: '24%',
  },
  witch: {
    height: 250,
    width: 250,
    transform: [{ rotate: '25deg' }]
  }
})

export default HomeScreen