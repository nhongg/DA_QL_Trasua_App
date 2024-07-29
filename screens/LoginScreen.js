import { Image, StyleSheet, Text, TextInput, View, CheckBox, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = ({ navigation }) => {
    const [pass, setpass] = useState('')
    const [user, setuser] = useState('')
    const [remember, setremember] = useState(false)
    const [showPass, setshowPass] = useState(true);

    const Login = async () => {
        const User = {
            username: user,
            password: pass
        }
        const url = `${URL}/login`
        const res = await fetch(url,
            {
                method: "POST",
                body: JSON.stringify(User),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const data = await res.json();
        if (res.status != 200) {
            if (Platform.OS === 'ios') {
                Alert.alert(data.msg);
            } else {
                ToastAndroid.show(data.msg, 0);
            }
            return;
        }
        if (data.status == 200) {
            if(data.data.block){
                if(Platform.OS==='ios'){
                    return Alert.alert('Tài khoản bị khoá')
                }
                return ToastAndroid.show('Tài khoản bị khoá',0)
            }
            if (Platform.OS === 'ios') {
                Alert.alert(data.msg);
            } else {
                ToastAndroid.show(data.msg, 0);
            }
            // Lưu thông tin người dùng vào AsyncStorage
            try {
                await AsyncStorage.setItem('User', JSON.stringify(data.data));
                // Điều hướng đến màn hình chính sau khi lưu thông tin thành công
                rememberAccount();
                navigation.navigate('Main');
            } catch (error) {
                console.error('Lỗi khi lưu thông tin người dùng vào AsyncStorage:', error);
            }
        }
        
    }

    // hàm checkremember
    const rememberAccount = async () => {
        try {
            if (remember) {
                await AsyncStorage.setItem('username', user);
                await AsyncStorage.setItem('password', pass);
            } else {
                await AsyncStorage.setItem('username', '');
                await AsyncStorage.setItem('password', '');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // hàm lấy thông tin từ asyncStorage
    const retrieveData = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedPassword = await AsyncStorage.getItem('password');
            if (storedUsername !== null && storedPassword !== null) {
                setuser(storedUsername);
                setpass(storedPassword);
                setremember(true);
            } else {
                setpass('');
                setremember(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        retrieveData()
    }, [])


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <Image style={{ width: 250, height: 250 }}
                    source={require('../assets/image/logo.png')} />
                <View style={{ gap: 30 }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', justifyContent: 'center', fontSize: 24 }}>Đăng nhập để tiếp tục</Text>
                    <View style={{ gap: 10 }}>
                        <Text style={{ fontSize: 13, color: 'gray' }}>YOUR USERNAME</Text>
                        <TextInput style={[styles.input, { width: '90' }]}
                            placeholder='Nhập username' onChangeText={(txt) => {
                                setuser(txt)
                            }}
                            value={user.toLocaleLowerCase().trim()} />
                    </View>
                    <View style={{ gap: 10, width: '90%' }}>
                        <Text style={{ fontSize: 13, color: 'gray' }}>PASSWORD</Text>
                        <View style={styles.input}>
                            <TextInput style={{ width: '90%' }} secureTextEntry={showPass ? true : false}
                                placeholder='Nhập mật khẩu' onChangeText={(txt) => {
                                    setpass(txt)
                                }}
                                value={pass.toLocaleLowerCase().trim()} />
                            <TouchableOpacity onPress={() => setshowPass(!showPass)}>
                                <Image style={{ width: 22, height: 22 }}
                                    source={showPass ? require('../assets/image/visible.png') : require('../assets/image/invisible.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => { setremember(!remember) }}>
                                <Image style={{ width: 20, height: 20 }}
                                    source={remember ? require('../assets/image/checkbox.png') : require('../assets/image/checkboxempty.png')} />
                            </TouchableOpacity>
                            <Text style={{ marginLeft: 10 }}>Nhớ tài khoản</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={() => { Login() }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#FFFFFF' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <View style={{borderWidth:1,borderColor:'brown',width:'35%',marginHorizontal:10}}></View>
                        <Text>Hoặc</Text>
                        <View style={{borderWidth:1,borderColor:'brown',width:'35%',marginHorizontal:10}}></View>


                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity>
                            <Image style={styles.image}
                                source={require('../assets/image/google.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Image style={[styles.image, { marginLeft: 40 }]}
                                source={require('../assets/image/facebook.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        borderRadius: 20,
        backgroundColor: 'rgba(150, 75, 0, 1.0)',
        padding: 15,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowRadius: 5,
        shadowOpacity: 0.35,
        elevation: 10
    },
    image: {
        width: 50,
        height: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
})