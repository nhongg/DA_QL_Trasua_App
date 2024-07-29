import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckBill = ({ navigation, route }) => {
    const { tongTien, khachHang, soDichVu } = route.params;



    // hàm format price
    const formatPrice = (price) => {
        // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const finalBill = async (status) => {
        const id = await AsyncStorage.getItem('id_Bill');
        const url = `${URL}/hoadons/update/${id}`;

        const FinalBill = {
            id_KhachHang: khachHang._id,
            tongTien: tongTien,
            trangThai: status
        }

        const res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(FinalBill),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        if (data.status == 200) {
            ToastAndroid.show("Thêm hóa đơn thành công", 0);
            await AsyncStorage.setItem('id_Bill', '');
            navigation.popToTop();
        }else{
            ToastAndroid.show("Thêm hóa đơn không thành công", 0);
        }
    }

    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../assets/image/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>CHECK BILL</Text>
                <View />
            </View>

            <Text>Khách hàng : {khachHang.tenKhachHang}</Text>
            <Text>Số điện thoại : {khachHang.dienThoai}</Text>
            <Text>Địa chỉ : {khachHang.diaChi}</Text>
            <Text>Tổng tiền : {formatPrice(tongTien)}</Text>
            <Text>Sử dụng : {soDichVu} dịch vụ</Text>



            <TouchableOpacity onPress={() => finalBill(1)}
                style={{ padding: 20, backgroundColor: 'green' }}>
                <Text>Đã hoàn thành thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => finalBill(0)}
                style={{ padding: 20, backgroundColor: 'pink' }}>
                <Text>Chờ xử lý</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CheckBill

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 16
    },
    header: {
        width: "100%",
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        width: 24,
        height: 24
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
      },
})