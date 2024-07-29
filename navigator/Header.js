import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Header = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('OptionMenu')}>
                    <Image source={require('../assets/image/menu.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
                    <Image source={require('../assets/image/pesonal.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 66,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 25,
        marginTop: 10,
        alignItems: 'center'
    },
    icon: {
        width: 24,
        height: 24
    },
})