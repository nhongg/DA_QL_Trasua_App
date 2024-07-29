import { Alert, FlatList, Image, Modal, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';

const KhachHangScreen = ({ navigation }) => {

  const [listKhachHang, setlistKhachHang] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false)
  const [addModel, setaddModel] = useState(false)
  const [idItem, setidItem] = useState('');
  const [checkAdd, setcheckAdd] = useState(true)

  const [tenKhachHang, settenKhachHang] = useState('')
  const [dienThoai, setdienThoai] = useState('')
  const [diaChi, setdiaChi] = useState('')


  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^0\d{9}$/;
    return regex.test(phoneNumber);
  };

  const getData = async () => {
    const url = `${URL}/khachhangs`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setlistKhachHang(data);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData()
  }, [])


  const renderItem = ({ item }) => {
    return (
      <View style={styles.crud}>
        <View style={styles.khachHang}>
          <Image style={{ width: 80, height: 80 }}
            source={require('../assets/image/guest.png')} />
          <View style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>{item.tenKhachHang}</Text>
            <Text>{item.dienThoai}</Text>
            <Text>{item.diaChi}</Text>
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <TouchableOpacity style={{ width: '70%' }}
                onPress={() => {
                  setaddModel(true)
                  setidItem(item._id)
                  settenKhachHang(item.tenKhachHang)
                  setdienThoai(item.dienThoai)
                  setdiaChi(item.diaChi)
                  setcheckAdd(false)
                }}>
                <Text style={{ textAlign: 'right', textDecorationLine: 'underline' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setidItem(item._id)
                  setDeleteModal(true)
                }}>
                <Text style={{ textAlign: 'right', textDecorationLine: 'underline' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    )
  }



  const addKhachHang = async () => {

    if (tenKhachHang == '' || diaChi == '' || dienThoai == '') {
      if (Platform.OS === 'ios') {
        Alert.alert('Không được để trống')
      } else {
        ToastAndroid.show('Không được để trống', 0)
      }
      return;
    }

    if (isNaN(dienThoai) || dienThoai.length != 10) {
      if (Platform.OS === 'ios') {
        Alert.alert('Số điện thoại phải là số và có 10 số')
      } else {
        ToastAndroid.show('Số điện thoại phải là số và có 10 số', 0)
      }
      return;
    }

    if(!validatePhoneNumber(dienThoai)){
      if (Platform.OS === 'ios') {
        Alert.alert('Số điện thoại không đúng định dạng')
      } else {
        ToastAndroid.show('Số điện thoại không đúng định dạng', 0)
      }
      return;
    }

      
  const NewKhachHang = {
    tenKhachHang: tenKhachHang,
    dienThoai: dienThoai,
    diaChi: diaChi
  }

    const urlUpdate = `${URL}/khachhangs/put/${idItem}`;
    const urlAdd = `${URL}/khachhangs/post`;

    const linkAPI = checkAdd ? urlAdd : urlUpdate;

    const method = checkAdd ? 'POST' : 'PUT';

    const res = await fetch(linkAPI, {
      method: method,
      body: JSON.stringify(NewKhachHang),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 200) {
      if (Platform.OS === 'ios') {
        Alert.alert(data.msg)
      } else {
        ToastAndroid.show(data.msg, 0)
      }

      getData()
      setaddModel(false)
      return;
    } else {
      if (Platform.OS === 'ios') {
        Alert.alert(data.msg)
      } else {
        ToastAndroid.show(data.msg, 0)
      }
    }
  }
  // delete khách hàng
  const deleteKhachHang = async () => {
    const url = `${URL}/khachhangs/delete/${idItem}`;
    const res = await fetch(url, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.status == 200) {
      Alert.alert(data.msg)
      getData()
    } else {
      Alert.alert(data.msg)
    }
  }

  const DeleteModal = () => {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={deleteModal}
      >
        <View style={styles.cardCotainer}>
          <View style={styles.cardModal}>
            <Text style={styles.textModal}>
              Bạn có muốn xóa không
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setDeleteModal(!deleteModal)
                }}>

                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  deleteKhachHang()
                  setDeleteModal(!deleteModal)
                }
                }>
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 24, height: 24 }}
            source={require('../assets/image/back.png')} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontSize: 18, fontWeight: 'bold' }}>Danh sách khách hàng</Text>
        <TouchableOpacity onPress={() => {
          setaddModel(true)
          setcheckAdd(true)
        }}>
          <Image style={{ width: 20, height: 20 }}
            source={require('../assets/image/add_user.png')} />
        </TouchableOpacity>
      </View>

      <FlatList
      showsVerticalScrollIndicator={false}
        data={listKhachHang}
        keyExtractor={item => item._id}
        renderItem={renderItem}></FlatList>

      <DeleteModal />

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModel}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setAddModalVisible(!addModel);
        }}>
        <View style={styles.cardCotainer}>
          <View style={styles.cardModal}>
            <Text style={styles.textModal}>Nhập thông tin </Text>
            <View style={{ width: '80%', gap: 20, justifyContent: 'space-around' }}>

              <TextInput placeholder='Nhập họ tên' style={styles.input}
                onChangeText={(txt) => settenKhachHang(txt)} value={!checkAdd ? tenKhachHang : null}/>
              <TextInput placeholder='Nhập số điện thoại' style={styles.input}
                onChangeText={(txt) => setdienThoai(txt)} value={!checkAdd ? dienThoai : null}/>
              <TextInput placeholder='Nhập địa chỉ' style={styles.input}
                onChangeText={(txt) => setdiaChi(txt)} value={!checkAdd ? diaChi : null}/>

            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  setaddModel(!addModel)
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => { addKhachHang() }}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>

  )
}

export default KhachHangScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30
  },
  khachHang: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  text: {
    width: '60%',
    gap: 10
  },
  crud: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7F7F7F',
    padding: 10,
    marginBottom: 10
  },
  cardCotainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  cardModal: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textModal: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#2196F3",

  },
  textStyle: {
    color: 'white'
  },
  input: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1
  },
})