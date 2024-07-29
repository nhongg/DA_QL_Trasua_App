import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { URL } from './HomeScreen';


const AddUpdateDichVu = ({ navigation, route }) => {
  const { item } = route.params;
  const isAdding = !item;

  const [selectedImage, setselectedImage] = useState(null);
  const [TenDichVu, setTenDichVu] = useState('');
  const [GiaTien, setGiaTien] = useState('');
  const [MoTa, setMoTa] = useState('');
  const [TrangThai, setTrangThai] = useState(true);
  const [Type, setType] = useState(true);
  const [checkAdd, setcheckAdd] = useState(true);
  const [idItem, setidItem] = useState(item?._id);

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

  const addOrUpdateDichVu = async () => {
    const urladd = `${URL}/dichvus/post`;
    const urlupdate = `${URL}/dichvus/put/${idItem}`;
    const linkAPI = isAdding ? urladd : urlupdate;
    const method = isAdding ? 'POST' : 'PUT';

    if (TenDichVu == '' || GiaTien == null) {
      return ToastAndroid.show('Vui lòng nhập đầy đủ thông tin', 0);
    }
    const NewDichVu = {
      tenDichVu: TenDichVu,
      trangThai: true,
      moTa: MoTa,
      giaTien: GiaTien,
      hinhAnh: selectedImage || 'https://i.pinimg.com/236x/50/25/d5/5025d51da54255dae9152d584afcb68b.jpg',
      type: Type
    }

    const res = await fetch(linkAPI, {
      method: method,
      body: JSON.stringify(NewDichVu),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json();
    console.log(data.data);
    if (data.status === 200) {
      setTimeout(() => {
        navigation.popToTop(2);
      }, 1500);
      
      resetData();
      ToastAndroid.show(data.msg, 0);
    } else {
      ToastAndroid.show(data.msg, 0);
    }
  }

  useEffect(() => {
    if (item != null && item != undefined) {
      setTenDichVu(item.tenDichVu);
      setGiaTien(item.giaTien);
      setMoTa(item.moTa);
      setTrangThai(item.trangThai);
      setType(item.type);
      setselectedImage(item.hinhAnh);
      setcheckAdd(false);
    }
  }, [navigation, checkAdd])
  

  const resetData = () => {
    setGiaTien('');
    setMoTa('');
    setTenDichVu('');
    setType(true);
    setselectedImage('');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{ width: 20, height: 20 }}
              source={require('../assets/image/back.png')} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Nhập thông tin dịch vụ</Text>
          <View />
        </View>
        <ScrollView>
          <View style={{ width: '100%', height: 230, justifyContent: 'space-between', alignItems: 'center' }}>

            <Image style={{ width: '100%', height: 200, borderRadius: 10 }} 
              source={{ uri:selectedImage || 'https://www.limelightonline.co.nz/uploads/Limlight_choosing%20the%20right%20image.png?resize=1&w=NaN&h=229' }} />
            <Text style={{ fontSize: 16 }}>Hình ảnh </Text>

          </View>
          <View style={styles.textInput}>
            <Text>Tên dịch vụ</Text>
            <TextInput style={styles.input}
              placeholder={'Tên Dịch vụ'}
              onChangeText={(txt) => setTenDichVu(txt)}
              value={TenDichVu} />
            <Text>Giá tiền</Text>
            <TextInput style={styles.input}
              placeholder={'Giá tiền'}
              keyboardType='numeric'
              onChangeText={(txt) => setGiaTien(txt)}
              value={String(GiaTien)}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <Text>Loại : </Text>
              <TouchableOpacity onPress={() => setType(true)}
                style={[styles.input, { flex: 1, alignItems: 'center', backgroundColor: Type ? 'green' : 'white' }]}>
                <Text style={{ color: Type ? 'white' : 'black' }}>Đồ ăn/ uống</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setType(false)}
                style={[styles.input, { flex: 1, alignItems: 'center', backgroundColor: !Type ? 'green' : 'white' }]}>
                <Text style={{ color: !Type ? 'white' : 'black' }}>Combo</Text>
              </TouchableOpacity>
            </View>

            <Text>Mô tả</Text>
            <TextInput style={[{ borderBottomWidth: 1 }]}
              placeholder={'Mô tả'}
              multiline={true}
              onChangeText={(txt) => setMoTa(txt)}
              value={MoTa} />
          </View>

          <TouchableOpacity onPress={PickImage}
            style={styles.button}>
            <Text>CHỌN ẢNH</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={addOrUpdateDichVu}
            style={styles.button}>
            <Text>{isAdding ? 'THÊM DỊCH VỤ' : 'CẬP NHẬT DỊCH VỤ'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AddUpdateDichVu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    gap: 16,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30
  },
  textInput: {
    padding: 5,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 10
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(222, 184, 135, 1.0)'
  }
});
