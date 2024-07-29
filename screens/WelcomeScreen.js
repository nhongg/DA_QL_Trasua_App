import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const WelcomeScreen = () => {
  return (
    <View style = {styles.background}>
      <Image style={styles.img} source={require('../assets/image/logo.png')}/>
      <Text style={{ fontWeight: 'bold', fontSize: 28 }}>Welcome</Text>
      <ActivityIndicator color={'black'}/>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        alignItems: 'center',
        height: '100%',
        gap: 10,
        justifyContent: 'center'
    },
    img: {
        width: 260,
        height: 260,
    }
})