import { View, Text, StyleSheet, Image, Animated, Easing, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { BackgroundImage } from '../helpers/GetIcons';
import LottieView from 'lottie-react-native';
import DiceRoll from '../assets/animation/diceroll.json';
import Arrow from '../assets/images/arrow.png';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPlayerChance, selectDiceNo, selectDiceRolled } from '../redux/reducers/gameSelectors';
import { enableCellSelection, enablePileSelection, updateDiceNo, updatePlayerChance } from '../redux/reducers/gameSlice';
import { playSound } from '../helpers/SoundUtility';

const Dice = React.memo(({ color, rotate, player, data }) => {

    const dispatch = useDispatch();
    const currentPlayerChance = useSelector(selectCurrentPlayerChance);
    const isDiceRolled = useSelector(selectDiceRolled);
    const diceNo = useSelector(selectDiceNo);
    const playerPieces = useSelector(state => state.game[`player${currentPlayerChance}`]);

    const pileIcon = BackgroundImage.GetImage(color);
    const diceIcon = BackgroundImage.GetImage(diceNo);

    const arrowAnim = useRef(new Animated.Value(0)).current;

    const [diceRolling, setDiceRolling] = useState(false)

    useEffect(() => {
        const animatedArrow = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(arrowAnim, {
                        toValue: 10,
                        duration: 600,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(arrowAnim, {
                        toValue: -10,
                        duration: 600,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true
                    }),
                ]),
            ).start();
        };

        animatedArrow();
    }, []);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const handleDicePress = async () => {
        const newDiceNo = Math.floor(Math.random() * 6) + 1;
        // const newDiceNo = 2;
        playSound('dice_roll');
        setDiceRolling(true);
        await delay(800);
        dispatch(updateDiceNo({ diceNo: newDiceNo }));
        setDiceRolling(false);

        const isAnyPieceAlive = data?.findIndex(i => i.pos != 0 && i.pos != 57);
        const isAnyPieceLocked = data?.findIndex(i => i.pos == 0);

        if (isAnyPieceAlive == -1) {
            if (newDiceNo == 6) {
                dispatch(enablePileSelection({ playerNo: player }));
            } else {
                let chancePlayer = player + 1;
                if (chancePlayer > 4) {
                    chancePlayer = 1;
                }
                await delay(600);
                dispatch(updatePlayerChance({ chancePlayer: chancePlayer }))
            }
        } else {
            const canMove = playerPieces.some(pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,);
            if ((!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) || (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) || (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)) {
                let chancePlayer = player + 1;
                if (chancePlayer > 4) {
                    chancePlayer = 1;
                }
                await delay(600);
                dispatch(updatePlayerChance({ chancePlayer: chancePlayer }))
                return;
            }

            if (newDiceNo == 6) {
                dispatch(enablePileSelection({ playerNo: player }));
            }
            dispatch(enableCellSelection({ playerNo: player }));

        }

    }

    return (
        <View style={[styles.flexRow, { transform: [{ scaleX: rotate ? -1 : 1 }] }]}>

            <View style={styles.border1}>
                <LinearGradient
                    style={styles.linearGradient}
                    colors={['#0052be', '#5f9fcb', '#97c6c9']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <View style={styles.pileIconContainer}>
                        <Image source={pileIcon} style={styles.pileIcon} />
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.border2}>
                <LinearGradient
                    style={styles.diceGradient}
                    colors={['#aac8ab', '#aac8ab', '#aac8ab']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <View style={styles.diceContainer}>

                        {currentPlayerChance === player && !diceRolling && (
                            <TouchableOpacity
                                disabled={isDiceRolled}
                                activeOpacity={0.4}
                                onPress={handleDicePress}
                            >
                                <Image source={diceIcon} style={styles.dice} />
                            </TouchableOpacity>
                        )}

                    </View>
                </LinearGradient>
            </View>

            {currentPlayerChance === player && !isDiceRolled && (
                <Animated.View style={{ transform: [{ translateX: arrowAnim }] }}>
                    <Image source={Arrow} style={{ height: 30, width: 50 }} />
                </Animated.View>
            )}

            {currentPlayerChance === player && diceRolling && (
                <LottieView
                    source={DiceRoll}
                    style={styles.rollingDice}
                    loop={false}
                    autoPlay
                    cacheComposition={true}
                    hardwareAccelerationAndroid
                />
            )}

        </View>
    );
});

const styles = StyleSheet.create({
    flexRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    border1: {
        borderWidth: 3,
        borderEndWidth: 0,
        borderColor: '#f0ce2c'
    },
    border2: {
        borderRadius: 3,
        padding: 1,
        backgroundColor: '#aac8ab',
        borderRadius: 10,
        borderLeftWidth: 3,
        borderColor: '#aac8ab'
    },
    linearGradient: {

    },
    diceGradient: {
        borderWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#f0ce2c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pileIcon: {
        height: 35,
        width: 35,
    },
    pileIconContainer: {
        paddingHorizontal: 3
    },
    diceContainer: {
        backgroundColor: '#e8c0c1',
        borderWidth: 1,
        borderRadius: 5,
        width: 55,
        height: 55,
        paddingHorizontal: 8,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dice: {
        height: 45,
        width: 45,
    },
    rollingDice: {
        height: 80,
        width: 80,
        zIndex: 99,
        top: -25,
        position: 'absolute'
    },
});

export default Dice