import { FlatList, Image, Modal, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';

const DetailBill = ({ navigation, route }) => {

    const khachhang = route.params?.khachhang;
    const item = route.params?.item;
    const [ListHoaDonChitiet, setListHoaDonChitiet] = useState([]);
    const [ListDichVu, setListDichVu] = useState([]);
    const [modalVisible, setmodalVisible] = useState(false);
    const [checkDelete, setcheckDelete] = useState(true);


    const getListHDCT = async () => {
        const url = `${URL}/hoadonchitiets?id_HoaDon=${item._id}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setListHoaDonChitiet(data);
            console.log('Bill: ', data);

        } catch (error) {
            console.log(error);
        }
    }

    const getListDichVu = async () => {
        const url = `${URL}/dichvus`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setListDichVu(data);
        } catch (err) {
            console.log(err);
        }
    };


    const updateBill = async (status) => {
        const url = `${URL}/hoadons/update/${item._id}`;

        const FinalBill = {
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
            ToastAndroid.show("Cập nhật hóa đơn thành công", 0);
            navigation.goBack()
        } else {
            ToastAndroid.show("Cập nhật hóa đơn không thành công", 0);
        }
    }

    useEffect(() => {
        getListHDCT();
        getListDichVu()
    }, [item]);


    const formatPrice = (price) => {
        // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };


    //modal delete
    const ModalConfirm = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View
                    style={styles.cardCotainer}>
                        <View/>
                    <View style={styles.cardModal}>
                        <Text style={styles.textModal}>
                            Vui lòng xác nhận!
                        </Text>

                        <View style={{ flexDirection: "row", gap: 30 }}>
                            <Pressable
                                style={[styles.button]}
                                onPress={() => {
                                    setmodalVisible(!modalVisible)
                                }}>
                                <Text style={styles.text}>Không</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button]}
                                onPress={() => { setmodalVisible(!modalVisible),
                                checkDelete ? updateBill(-1) : updateBill(1) }}>
                                <Text style={styles.text}>Xác nhận</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    const renderItem = ({ item }) => {
        const dichvu = ListDichVu.find(dv => dv._id == item.id_DichVu);

        return (
            <View style={styles.card}>
                <Image source={{ uri: dichvu?.hinhAnh }} style={{ width: 120, height: 120 }} />
                <View>
                    <Text>Dịch vụ : {dichvu?.tenDichVu}</Text>
                    <Text>Giá tiền : {formatPrice(item.giaTien)}</Text>
                    <Text>Số lượng : {item.soLuong}</Text>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../assets/image/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>CHI TIẾT HÓA ĐƠN</Text>
                <View />
            </View>
            <Text>Mã hóa đơn : {item._id}</Text>
            <Text>Trạng thái hóa đơn : {item.trangThai == 0
                ? <Text style={{ color: 'red' }}>Đang chờ xử lý</Text>

                : (item.trangThai == 1
                    ? <Text style={{ color: 'green' }}>Đã hoàn thành</Text>
                    : <Text style={{ color: 'red' }}>Đã bị hủy</Text>)}</Text>

            <Text>Khách hàng : {khachhang.tenKhachHang}</Text>
            <Text>Số điện thoại : {khachhang.dienThoai}</Text>
            <Text>Địa chỉ : {khachhang.diaChi}</Text>
            <Text>Tổng tiền: {formatPrice(item.tongTien)}</Text>


            <Text>Các dịch vụ sử dụng</Text>

            <FlatList
                data={ListHoaDonChitiet}
                keyExtractor={item => item._id}
                renderItem={renderItem}>
            </FlatList>

            {item.trangThai == 0
                ? <View style={{ flexDirection: 'row', gap: 30 }}>
                    <Pressable onPress={() => {setmodalVisible(true),setcheckDelete(false)}}
                        style={styles.button}>
                        <Text style={styles.text}>Hoàn thành</Text>
                    </Pressable>
                    <Pressable onPress={() => {setmodalVisible(true),setcheckDelete(true)}}
                        style={[styles.button, { backgroundColor: 'red' }]}>
                        <Text style={{ color: 'white' }}>Hủy bỏ</Text>
                    </Pressable>
                </View>
                : null}

             <ModalConfirm/>   
        </View>
    )
}

export default DetailBill

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
    button: {
        borderRadius: 10,
        padding: 10,
        width: '45%',
        alignItems: "center",
        backgroundColor: "#2196F3",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    cardCotainer: {
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardModal: {
        width: "93%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    text:{ color: 'white' },
    textModal: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    card: { flexDirection: 'row', gap: 20, padding: 10, marginTop: 15, borderBottomWidth: 1, alignItems: 'center' }
})