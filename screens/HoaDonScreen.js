import { ActivityIndicator, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';

const HoaDonScreen = ({ navigation }) => {
  const [loading, setloading] = useState(true);

  const [ListHoaDon, setListHoaDon] = useState([]);
  const [ListTrangThai, setListTrangThai] = useState([]);
  const [ListKhachHang, setListKhachHang] = useState([]);
  const [trangThai, settrangThai] = useState('2');


  const getData = async () => {
    const url = `${URL}/hoadons`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const listData = data;
      const list = listData.filter((hd) => hd.id_KhachHang != null);
      setListHoaDon(list);
      if (trangThai != '' || trangThai == 0) {
        const list = ListHoaDon.filter((hd) => hd.trangThai == trangThai);
        setListTrangThai(list);
      }
      setloading(false)
      // console.log(list);
    } catch (error) {
      console.log(error);
    }
  }


  const getKhachHangs = async () => {
    const url = `${URL}/khachhangs`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setListKhachHang(data);
      setloading(false)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // cập nhật giao diện ở đây
      getData();
      getKhachHangs();
    });

    return unsubscribe;

  }, [navigation, trangThai]);



  useEffect(() => {
    getData();
    getKhachHangs();
  }, [trangThai]);



  


  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    // Trả về ngày được định dạng là yyyy-MM-dd
    return `${year}-${month}-${day}`;
  }

  // hàm format price
  const formatPrice = (price) => {
    // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const renderItem = ({ item }) => {
    const khachhang = ListKhachHang.find((kh) => kh._id === item.id_KhachHang);
    return (
      <TouchableOpacity onPress={() => {navigation.navigate('DetailBill',{
        item : item,
        khachhang : khachhang
      })}}
        style={[styles.card, {
          borderColor: item.trangThai === 0 ? 'red' : (item.trangThai === 1 ? 'green' : 'gray'),
          backgroundColor: item.trangThai === -1 ? 'gray' : 'white'
        }]}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{khachhang?.tenKhachHang}</Text>
        <Text>Tổng tiền : {formatPrice(item.tongTien)} - -
          Ngày : {formatDate(item.createdAt)}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>Danh sách hóa đơn</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Pressable onPress={() => settrangThai(2)}
          style={[styles.btn]}>
          <Text>All</Text>
        </Pressable>
        <Pressable onPress={() => settrangThai(1)}
          style={[styles.btn, { borderColor: 'green' }]}>
          <Text>Hoàn Thành</Text>
        </Pressable>
        <Pressable onPress={() => settrangThai(0)}
          style={[styles.btn, { borderColor: 'red' }]}>
          <Text>Đang chờ</Text>
        </Pressable>
        <Pressable onPress={() => settrangThai(-1)}
          style={[styles.btn, { backgroundColor: 'gray' }]}>
          <Text>Đã hủy</Text>
        </Pressable>
      </View>
      {loading ? <ActivityIndicator color={'black'} />
        :
        <FlatList
        showsVerticalScrollIndicator={false}
          data={ListTrangThai.length > 0 ? ListTrangThai : ListHoaDon}
          keyExtractor={item => item._id}
          renderItem={renderItem}></FlatList>}
 
    </View>
  )
}

export default HoaDonScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60
  },
  card: {
    marginTop: 10,
    padding: 20,
    borderWidth: 2,
    borderRadius: 8,
    width: '94%',
    marginHorizontal: 12,
  },
  btn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10
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
    width: 20,
    height: 20
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
  }
})