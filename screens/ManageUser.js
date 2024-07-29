import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { URL } from './HomeScreen';
import emailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage'


const ManageUser = ({ navigation, route }) => {

  const { User } = route.params;

  const [selectedImage, setselectedImage] = useState(null);
  const [id_NhanVien, setId_NhanVien] = useState(User._id);
  const [Fullname, setFullname] = useState(User.fullname);
  const [Email, setEmail] = useState(User.email);
  const [Address, setAddress] = useState(User.address);
  const [Phone, setPhone] = useState(User.phone);

  // Check email
  const isValidEmail = emailValidator.validate(Email);
  console.log('Email: ', isValidEmail);

  //check phone
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^0\d{9}$/;
    return regex.test(phoneNumber);
  };

  // Sử dụng hàm validatePhoneNumber:
  const isValidPhoneNumber = validatePhoneNumber(Phone);
  console.log('Số điện thoại ', isValidPhoneNumber, '\n'); // true


  const newData = {
    fullname: Fullname,
    email: Email,
    address: Address,
    phone: Phone
  }
  const saveProfile = async () => {
    try {
      if (Fullname === '' || Email === '' || Address === '' || Phone === '') {
        if (Platform.OS === 'ios') {
          Alert.alert('Không được để trống thông tin!');
        }
        else {
          ToastAndroid.show('Không được để trống thông tin!', 0)
        }
      }
      else if (!isValidEmail) {
        if (Platform.OS === 'ios') {
          Alert.alert('Email không đúng định dạng!');
        }
        else {
          ToastAndroid.show('Email không đúng định dạng!', 0)
        }
      }
      else if (!isValidPhoneNumber) {
        if (Platform.OS === 'ios') {
          Alert.alert('Số điện thoại không đúng định dạng!');
        }
        else {
          ToastAndroid.show('Số điện thoại không đúng định dạng!', 0)
        }
      }
      else {

        const reponse = await fetch(`${URL}/nhanviens/put/${id_NhanVien}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        });
        const data = await reponse.json();
        console.log(data);
        if (data.status == 200) {
          Alert.alert(data.msg, 0);
          navigation.goBack()
          setTimeout(() => {
            navigation.navigate('LoginScreen')
            ToastAndroid.show('Đăng nhập lại để cập nhật thông tin',0)
          }, 500);
        }
        else {
          ToastAndroid.show(data.msg, 0);

        }

      }
    } catch (error) {
      console.log('Lỗi ', error);
    }
  }


  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setselectedImage(result.assets[0].uri)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 20, height: 20 }}
            source={require('../assets/image/back.png')} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 80, fontSize: 18, fontWeight: 'bold' }}>Chỉnh sửa thông tin</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', height: 230, justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <Image style={{ width: 200, height: 200, borderRadius: 30 }}
            source={User.avatar || selectedImage ? { uri: selectedImage || User.avatar } : require('../assets/image/pesonal.png')} />
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Bấm vào thông tin chi tiết để chỉnh sửa</Text>
        </View>
        <TouchableOpacity onPress={PickImage}
          style={{
            backgroundColor: 'rgba(222, 184, 135, 1.0)',
            borderRadius: 10,
            padding: 15,
            marginHorizontal: 100,
            marginTop: 10,
            alignItems: 'center'
          }}>
          <Text>CHỌN ẢNH</Text>
        </TouchableOpacity>
        <View style={styles.textInput}>
          <TextInput style={styles.input} value={Fullname} placeholder='Full name' onChangeText={(txt) => setFullname(txt)} />
          <TextInput style={styles.input} value={Email} placeholder='Email' onChangeText={(txt) => setEmail(txt.toLocaleLowerCase().trim())} />
          <TextInput style={styles.input} value={Address} placeholder='Address' onChangeText={(txt) => setAddress(txt)} />
          <TextInput style={styles.input} keyboardType='numeric' value={Phone} placeholder='Phone' onChangeText={(txt) => setPhone(txt.trim())} />
        </View>
        <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>LƯU THÔNG TIN</Text>
        </TouchableOpacity></ScrollView>
    </View>
  )
}

export default ManageUser

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30
  },
  textInput: {
    padding: 10,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 15
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'green',
    alignItems: 'center'
  }
})