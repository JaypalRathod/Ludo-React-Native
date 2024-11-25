import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { announceWinner, resetGame } from '../redux/reducers/gameSlice';
import { playSound } from '../helpers/SoundUtility';
import { goBack } from '../helpers/NavigationUtils';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import GradiantButton from './GradiantButton';

const MenuModel = ({ visible, onPressHide }) => {
    const dispatch = useDispatch();

    const handleNewGame = useCallback(() => {
        dispatch(resetGame());
        playSound('game_start');
        dispatch(announceWinner(null));
        onPressHide();
    }, [dispatch, onPressHide])

    const handleHome = useCallback(() => {
        goBack();
    }, []);

    return (
        <Modal
            style={styles.bottomModalView}
            isVisible={visible}
            backdropColor='black'
            backdropOpacity={0.8}
            onBackdropPress={onPressHide}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            onBackButtonPress={onPressHide}
        >
            <View style={styles.modalContainer}>
                <LinearGradient
                    colors={['#0f0c29', '#302b63', '#24243e']}
                    style={styles.gradientContainer}
                >
                    <View style={styles.subView}>
                        <GradiantButton title='RESUME' onPress={onPressHide} />
                        <GradiantButton title='NEW GAME' onPress={handleNewGame} />
                        <GradiantButton title='HOME' onPress={handleHome} />
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bottomModalView: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: '95%',
    },
    modalContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        padding: 20,
        paddingVertical: 40,
        width: '96%',
        borderWidth: 2,
        borderColor: 'gold',
        justifyContent: 'center',
        alignItems: 'center'
    },
    subView: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default MenuModel