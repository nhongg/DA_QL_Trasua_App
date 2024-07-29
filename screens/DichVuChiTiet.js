import { Alert, Image, ImageBackground, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DichVuChiTiet = ({ navigation, route }) => {
  const { item } = route.params;
  const [User, setUser] = useState([]);
  const [idItem, setidItem] = useState(item?._id);
  const [optionVisible, setoptionVisible] = useState(false);
  const [DeleteVisible, setDeleteVisible] = useState(false);
  const [checkAdd, setcheckAdd] = useState(true);

  // modal option
  const OptionModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={optionVisible}>
        <View
          style={styles.cardCotainer}>
          <View style={styles.cardModal}>
            <Text style={styles.textModal}>
              Chức năng quản lý
            </Text>

            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  setoptionVisible(!optionVisible), navigation.navigate('AddUpdateDichVu', { item: item })
                }}>
                <Text style={styles.textStyle}>Update</Text>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => { setoptionVisible(false), setDeleteVisible(true) }}>
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
            </View>

            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 20 }}
              onPress={() => setoptionVisible(false)}>
              <Image style={styles.icon}
                source={require('../assets/image/cancel.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  //modal delete
  const ModalDelete = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={DeleteVisible}>
        <View
          style={styles.cardCotainer}>
          <View style={styles.cardModal}>
            <Text style={styles.textModal}>
              Bạn có chắc chắn muốn xóa không?
            </Text>

            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  setDeleteVisible(!DeleteVisible)
                }}>
                <Text style={styles.textStyle}>Không</Text>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => { setDeleteVisible(!DeleteVisible), deleteDichVu(), navigation.goBack() }}>
                <Text style={styles.textStyle}>Đồng ý</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const deleteDichVu = async () => {
    const url = `${URL}/dichvus/delete/${idItem}`;
    const res = await fetch(url, {
      method: 'DELETE'
    });
    const data = await res.json();
    console.log(data)
    if (data.status == 200) {
      ToastAndroid.show(data.msg, 0);
    } else {
      ToastAndroid.show(data.msg, 0);
    }
  }

  const themVaoHoaDon = async () => {
    const id_Bill = await AsyncStorage.getItem('id_Bill');
    if (id_Bill != null) {
      const url = `${URL}/hoadonchitiets/post`
      const HDCT = {
        id_HoaDon: id_Bill,
        id_DichVu: item._id,
        giaTien: item.giaTien,
        soLuong:0
      }

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(HDCT),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json();
      if (data.status === 200) {
       if(Platform.OS==='android'){
        ToastAndroid.show(data.msg, 0);
       }else{
        Alert.alert(data.msg)
       }
        navigation.navigate("TaoHoaDon");
        setcheckAdd(true);
      } else {
        if(Platform.OS==='android'){
          ToastAndroid.show(data.msg, 0);
         }else{
          Alert.alert(data.msg)
         }
      }
    } else {
      addBill();
    }
  }

  const addBill = async () => {
    const url = `${URL}/hoadons/post`;
    const NewBill = {
      id_NhanVien: User._id
    }

    const res = await fetch(url,
      {
        method: "POST",
        body: JSON.stringify(NewBill),
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const data = await res.json();
    if (data.status == 200) {
      const id_Bill = data.data._id;
      await AsyncStorage.setItem('id_Bill', id_Bill);
      themVaoHoaDon();
      console.log(data.data._id);
    }
  }

  const formatPrice = (price) => {
    // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  useEffect(() => {
    item
  }, [item])


  return (
    <View style={styles.container}>
      <View style={{ height: '70%' }}>
        <ImageBackground style={{ width: '100%', height: '100%', justifyContent: 'space-between' }} resizeMode='cover'
          source={{
            uri: item.hinhAnh
          }}>
          <View style={styles.header}>
            <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: 4 }}
              onPress={() => { navigation.goBack() }}>
              <Image source={require('../assets/image/back.png')} style={styles.icon} tintColor={'white'} />
            </TouchableOpacity>
            <Text style={styles.title}>{item.tenDichVu}</Text>
            <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: 4 }}
              onPress={() => { setoptionVisible(true) }}>
              <Image source={require('../assets/image/open-menu.png')} style={styles.icon} tintColor={'white'} />
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.price}>      Giá : <Text style={{ color: 'white', fontSize: 22 }}>{formatPrice(item.giaTien)}</Text></Text>
            {item.trangThai ? <Text style={[styles.price, { color: 'white' }]}>      Còn hàng</Text>
              : <Text style={[styles.price, { color: 'red' }]}>      Hết hàng</Text>}
          </View>

          <OptionModal />
          <ModalDelete />

        </ImageBackground>
      </View>
      <View style={{
        height: '23%', marginBottom: '1%',
        padding: 20
      }}>
        <ScrollView style={{ height: 150, gap: 12 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 22, fontWeight: '700' }}>Mô tả</Text>
          <Text style={{ fontSize: 22 }}>{item.moTa}</Text>
        </ScrollView>
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: !checkAdd ? 'rgba(222, 184, 135, 1.0)' : 'rgba(222, 184, 135, 1.0)', }]} onPress={() => themVaoHoaDon()}>
        <Text>Tạo hóa đơn ngay</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DichVuChiTiet

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 60, marginBottom: 10, paddingHorizontal: 20 },
  icon: {
    width: 20,
    height: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white'
  },
  btn: {
    height: 50,
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: 'rgba(222, 184, 135, 1.0)',
    padding: 15,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
  },
  info: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    height: '16%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    gap: 12
  },
  textName: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
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
  icon: {
    width: 20, height: 20
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
})