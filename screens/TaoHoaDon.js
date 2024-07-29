import { Alert, FlatList, Image, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaoHoaDon = ({ navigation }) => {

    const [listKhachHang, setlistKhachHang] = useState([]);
    const [KhachHang, setKhachHang] = useState([]);
    const [ListDichVu, setListDichVu] = useState([]);
    const [idKhachHang, setidKhachHang] = useState('');
    const [SoDienThoai, setSoDienThoai] = useState();
    const [DiaChi, setDiaChi] = useState();
    const [quantities, setQuantities] = useState({});
    const [TongTien, setTongTien] = useState(0);

    const [listHDCT, setlistHDCT] = useState([]);


    const getData = async () => {
        const id = await AsyncStorage.getItem('id_Bill');
        if (id != null) {
            const url = `${URL}/hoadonchitiets?id_HoaDon=${id}`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                setlistHDCT(data);
                console.log('Id được tạo bill: ', id);
                console.log(data.soLuong);

            } catch (error) {
                console.log(error);
            }
        }
        else {
            await AsyncStorage.removeItem('id_Bill');
        }

    }

    const getKH = async () => {
        const url = `${URL}/khachhangs`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setlistKhachHang(data);
            if (idKhachHang != "") {
                getInfo();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getDV = async () => {
        const url = `${URL}/dichvus`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setListDichVu(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getInfo = async () => {
        const url = `${URL}/khachhangs/byid?_id=${idKhachHang}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            const khachhang = data.data;
            setKhachHang(khachhang);
            setDiaChi(khachhang.diaChi);
            setSoDienThoai(khachhang.dienThoai);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteHDCT = async (id_DichVu) => {
        const url = `${URL}/hoadonchitiets/delete/${id_DichVu}`;
        const res = await fetch(url, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.status == 200) {
            ToastAndroid.show(data.msg, 0);
            getData();
        } else {
            ToastAndroid.show(data.msg, 0);
        }
    }

    const deleteHD = async () => {
        const id = await AsyncStorage.getItem('id_Bill');
        if (id != null && id != undefined) {
            console.log('Id xoá: ', id);
            const url = `${URL}/hoadons/delete/${id}`
            const res = await fetch(url, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.status == 200) {
                navigation.goBack();
                await AsyncStorage.removeItem('id_Bill');
            }
            console.log('====================================');
            console.log(data.msg);
            console.log('====================================');
        } else {
            navigation.goBack();
        }
    }

    const updateQuantity = async (id_CTHD, soLuongSave) => {
        try {
            const res = await fetch(`${URL}/hoadonchitiets/put/${id_CTHD}`, {
                method: 'PUT',
                body: JSON.stringify({ soLuong: soLuongSave }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            if (data.status === 200) {
                console.log(data);
            }
            else {
                console.log(data);
                console.log('Kiểm tra lại');
            }

        } catch (error) {
            console.log(error);
            ToastAndroid.show('Lỗi', 0)
        }
    }
    useEffect(() => {
        getKH();
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                getDV();
                getData();
            }, 1);
        });
        return unsubscribe;
    }, [idKhachHang, navigation, ListDichVu,listHDCT])

    // hàm format price
    const formatPrice = (price) => {
        // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };



    // useEffect(() => {
       
    //     // Tính tổng tiền của tất cả các mục
    //     const totalBill = Object.keys(quantities).reduce((total, key) => {
    //         const dichVu = ListDichVu.find(dv => dv._id == key);
    //         const giaTien = dichVu ? dichVu.giaTien : 0;
    //         return total + quantities[key] * giaTien;
    //     }, 0);
    //     // Cập nhật tổng tiền
    //     setTongTien(totalBill);
    // }, [quantities]);





    useEffect(() => {
        // Tính tổng tiền của tất cả các mục
        let total = 0;
        listHDCT.forEach(item => {
            const dichVu = ListDichVu.find(dv => dv._id == item.id_DichVu);
            const giaTien = dichVu ? dichVu.giaTien : 0;
            const Quantity = quantities[item.id_DichVu] || 0;
            total += giaTien * Quantity;
        });
        // Cập nhật state mới
        setTongTien(total);
    }, [quantities, listHDCT]);


    const renderItem = ({ item, index }) => {
        const dichvu = ListDichVu.find(dv => dv._id == item.id_DichVu);
        const Quantity = quantities[item.id_DichVu] || 0; // Số lượng của mục đang được hiển thị

        const decreaseQuantity = async (id_CTHD) => {
            if (Quantity > 1) {
                setQuantities({
                    ...quantities,
                    [item.id_DichVu]: Quantity - 1
                });
                await updateQuantity(id_CTHD, Quantity - 1)
            } else {
                deleteHDCT(item._id)
                setTongTien(0)
            }
        };

        const increaseQuantity = async (id_CTHD) => {
            setQuantities({
                ...quantities,
                [item.id_DichVu]: Quantity + 1
            });
            await updateQuantity(id_CTHD, Quantity + 1)

        };

        const totalPrice = item.giaTien * Quantity;

        return (
            <View style={{ marginTop: 15, borderWidth: 1, padding: 14, borderRadius: 10, flexDirection: 'row', gap: 20 }}>
                <Image source={{ uri: dichvu?.hinhAnh }} style={{ width: 100, height: 100 }} />
                <View style={{ gap: 4 }}>
                    <Text>{dichvu?.tenDichVu}</Text>
                    <Text>Giá : {formatPrice(item.giaTien)}</Text>

                    <Text>Tạm tính : {formatPrice(totalPrice)}</Text>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity style={styles.btn} onPress={() => decreaseQuantity(item._id)}>
                            <Image source={require('../assets/image/tru.png')} style={{ width: 10, height: 10 }} />
                        </TouchableOpacity>
                        <Text>{Quantity}</Text>
                        <TouchableOpacity style={styles.btn} onPress={() => increaseQuantity(item._id)}>
                            <Image source={require('../assets/image/add.png')} style={{ width: 10, height: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }



    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { listHDCT.length == 0 ? deleteHD() : navigation.goBack() }}>
                    <Image source={require('../assets/image/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>TẠO HÓA ĐƠN</Text>
                <View />
            </View>

            <View style={[styles.input, { padding: 0 }]}>
                <Text> Khách hàng </Text>

                <Picker
                    selectedValue={idKhachHang}
                    onValueChange={(itemValue, itemIndex) => {
                        if (itemValue == '') {
                            setSoDienThoai("");
                            setDiaChi("");
                            setidKhachHang("")
                        } else {
                            setidKhachHang(itemValue)
                        }
                    }}>

                    <Picker.Item label='Chọn khách hàng' value='' />
                    {listKhachHang.map((kh) => (
                        <Picker.Item key={kh._id} label={kh.tenKhachHang} value={kh._id} />
                    ))}
                </Picker>

                <Text> Số điện thoại : {SoDienThoai}</Text>
                <Text> Địa chỉ : {DiaChi}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View />
                <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>Các sản phẩm đã chọn</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('DichVuScreen') }}
                    style={[styles.button, { backgroundColor: 'white' }]}>
                    <Image source={require('../assets/image/cloud.png')} style={styles.icon} />
                    <Text>Thêm</Text>
                </TouchableOpacity>
            </View>
            {listHDCT.length == 0 ?
                <Text style={{ textAlign: 'center' }}>Hóa đơn đang rỗng{'\n'} thêm ngay dịch vụ để tiếp tục</Text>
                : <View style={{ height: '69%' }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={listHDCT}
                        keyExtractor={item => item._id}
                        renderItem={renderItem}></FlatList>

                    <View style={{
                        padding: 20, backgroundColor: 'rgba(222, 184, 135, 1.0)',
                        flexDirection: 'row', justifyContent: 'space-between',
                        alignItems: 'center', borderRadius: 10
                    }}>
                        <Text>Tổng tiền : {formatPrice(TongTien)}</Text>
                        <Pressable onPress={() => {
                            let hasZeroQuantity = false;

                            // Lặp qua danh sách các mục để kiểm tra số lượng của mỗi mục
                            listHDCT.forEach(item => {
                                if (quantities[item.id_DichVu] == undefined) {
                                    // Nếu số lượng của một mục nào đó bằng 0, đặt biến flag thành true và thoát khỏi vòng lặp
                                    hasZeroQuantity = true;
                                    console.log(quantities[item.id_DichVu] );
                                    return;
                                }
                            });
                            if (idKhachHang == '') {
                                if (Platform.OS === 'ios') {
                                    Alert.alert('Vui lòng chọn khách hàng')
                                } else {
                                    ToastAndroid.show('Vui lòng chọn khách hàng', 0);
                                }
                            } else if (hasZeroQuantity) {
                                // Nếu có mục nào có quantities = 0, hiển thị thông báo hoặc xử lý tương ứng
                                if (Platform.OS == 'ios') {
                                    Alert.alert('Vui lòng kiểm tra lại số lượng!')
                                }
                                else {
                                    ToastAndroid.show('Vui lòng kiểm tra lại số lượng!', ToastAndroid.SHORT);
                                }
                            }
                            else {
                                navigation.navigate('CheckBill', {
                                    tongTien: TongTien,
                                    khachHang: KhachHang,
                                    soDichVu: listHDCT.length
                                })
                            }
                        }}
                       style={styles.button}>
                        <Text style={{ color: 'white' }}>Xác nhận</Text>
                        </Pressable>
                    </View></View>}
        </View>
    )
}

export default TaoHoaDon

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
    button: { padding: 10, backgroundColor: 'green', borderRadius: 5, gap: 10, flexDirection: 'row' },
    btn: { width: 20, height: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4 }
})