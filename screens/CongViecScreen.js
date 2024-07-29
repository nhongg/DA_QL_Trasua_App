import { FlatList, Image, Modal, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDataUser } from './OptionMenu';
const CongViecScreen = ({ navigation }) => {
    const [showPicker, setshowPicker] = useState(false);
    const [date, setdate] = useState(new Date());
    const [checkForm, setcheckForm] = useState(true);

    const [listCongViec, setlistCongViec] = useState([]);
    const [ListNhanVien, setListNhanVien] = useState([]);
    const [optionVisible, setoptionVisible] = useState(false);
    const [DeleteVisible, setDeleteVisible] = useState(false);
    const [AddVisible, setAddVisible] = useState(false);
    const [idItem, setidItem] = useState('');
    const [checkAdd, setcheckAdd] = useState(true)
    const [userProfile, setuserProfile] = useState([])

    const [tenCongViec, settenCongViec] = useState('');
    const [idNhanVien, setidNhanVien] = useState('');
    const [moTa, setmoTa] = useState('');
    const [fromDate, setfromDate] = useState('');
    const [toDate, settoDate] = useState('');
    const [trangThai, settrangThai] = useState(false);

    // lấy ds cv
    const getData = async () => {
        const url = `${URL}/congviecs`;
        const res = await fetch(url);
        const data = await res.json();
        setlistCongViec(data)
    }

    // lấy ds nv
    const getNhanVien = async () => {
        const url = `${URL}/nhanviens`;
        const res = await fetch(url);
        const data = await res.json();
        setListNhanVien(data)
    }

    useEffect(() => {
        getData();
        getNhanVien()
        const loadData = async ()=>{
            const data = await getDataUser()
            setuserProfile(data)
        }
        loadData()
    }, [])

    // Hàm chuyển đổi định dạng ngày
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

    // renderItem
    const renderItem = ({ item }) => {
        let nhanVien = ListNhanVien.find(nv => nv._id == item.id_NhanVien);
        const formatFromDate = formatDate(item.fromDate);
        const formatToDate = formatDate(item.toDate);
        return (
            <View style={styles.crud}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 17 }}>{item.tenCongViec}</Text>
                <Text>Nhân viên : {nhanVien?.fullname} - {item.trangThai == 0
                    ? <Text style={{ color: 'red' }}>Chưa làm</Text>
                    : <Text style={{ color: 'blue' }}>Đã làm</Text>}</Text>
                <Text>Mô tả : {item.moTa ? item.moTa : 'Không có'}</Text>
                <Text>Thời gian :  {formatFromDate} =={'>'} {formatToDate}</Text>
                {userProfile.role==1?<TouchableOpacity onPress={() => {
                    setidItem(item._id)
                    setoptionVisible(!optionVisible)
                    settenCongViec(item.tenCongViec)
                    setmoTa(item.moTa)
                    setfromDate(formatFromDate)
                    settoDate(formatToDate)
                    setidNhanVien(item.id_NhanVien)
                }}
                    style={[styles.icon, { position: 'absolute', right: 20, top: 15 }]}>
                    <Image source={require('../assets/image/open-menu.png')} style={styles.icon} />
                </TouchableOpacity>:null}
            </View>
        )
    }

    // delete công việc
    const deleteCongViec = async () => {
        const url = `${URL}/congviecs/delete/${idItem}`;
        const res = await fetch(url, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.status == 200) {
            ToastAndroid.show(data.msg, 0);
            getData()
        } else {
            ToastAndroid.show(data.msg, 0);
        }
    }

    // add and update công việc
    const addCongViec = async () => {
        const urlAdd = `${URL}/congviecs/add`;
        const urlUp = `${URL}/congviecs/update/${idItem}`;

        if (idNhanVien == '') {
            ToastAndroid.show('Vui lòng chọn nhân viên', 0);
            return;
        }
        if (tenCongViec == '' || fromDate == '' || toDate == '') {
            ToastAndroid.show('Không được để trống', 0);
            return;
        }

        const NewCongViec = {
            tenCongViec: tenCongViec,
            moTa: moTa,
            id_NhanVien: idNhanVien,
            fromDate: fromDate,
            toDate: toDate,
            trangThai: trangThai ? 1 : 0
        }

        const method = checkAdd ? 'POST' : 'PUT';
        const linkAPI = checkAdd ? urlAdd : urlUp;

        const res = await fetch(linkAPI, {
            method: method,
            body: JSON.stringify(NewCongViec),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        console.log(data);
        if (data.status === 200) {
            ToastAndroid.show(data.msg, 0);
            setAddVisible(!AddVisible)
            getData();
        } else {
            ToastAndroid.show(data.msg, 0)
        }
    }

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
                                    setoptionVisible(!optionVisible), setAddVisible(true)
                                    setcheckAdd(false);
                                }}>
                                <Text style={styles.textStyle}>Update</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button]}
                                onPress={() => { setDeleteVisible(!DeleteVisible), setoptionVisible(false) }}>
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
                                onPress={() => { setDeleteVisible(!DeleteVisible), deleteCongViec() }}>
                                <Text style={styles.textStyle}>Đồng ý</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    // modal celendar
    const toggleDatePicker = () => {
        setshowPicker(!showPicker);
    }

    // lấy date đc chọn    
    const onChange = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate;
            setdate(currentDate);
            if (Platform.OS === 'android') {
                toggleDatePicker();
                checkForm ? setfromDate(formatDate(currentDate)) : settoDate(formatDate(currentDate));
            }
        } else {
            toggleDatePicker();
        }
    }

    // lấy date IOS
    const confirmIOSDate = () => {
        checkForm ? setfromDate(formatDate(date)) : settoDate(formatDate(date))
        toggleDatePicker()
    }

    // reset dữ liệu
    const resetInput = () => {
        settenCongViec('');
        setmoTa('');
        setfromDate('');
        settoDate('');
        setidNhanVien('');
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, userProfile.role==0 ?{marginRight:'20%'}:null]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.icon}
                        source={require('../assets/image/back.png')} />
                </TouchableOpacity>
                <Text style={{ marginLeft: 20, fontSize: 18, fontWeight: 'bold' }}>Danh sách công việc</Text>
                {userProfile.role==1?<TouchableOpacity onPress={() => { setAddVisible(true), resetInput(), setcheckAdd(true) }}>
                    <Image style={styles.icon}
                        source={require('../assets/image/addjob.png')} />
                </TouchableOpacity>:null}
            </View>

            <FlatList
                data={listCongViec}
                keyExtractor={item => item._id}
                renderItem={renderItem}></FlatList>

            <OptionModal />
            <ModalDelete />
            <Modal animationType='slide'
                transparent={true}
                visible={AddVisible}>
                <View
                    style={styles.cardCotainer}>
                    <View style={styles.cardModal}>
                        <Text style={styles.textModal}>
                            Thông tin công việc
                        </Text>

                        <View style={styles.form}>
                            <View style={[styles.input, { padding: 0 }]}>
                                <Picker
                                    selectedValue={idNhanVien}
                                    onValueChange={(itemValue, itemIndex) => setidNhanVien(itemValue)}>
                                    <Picker.Item label='Chọn nhân viên' value='' />
                                    {ListNhanVien.filter(nv => nv.role == 0).map((nv) => (
                                        <Picker.Item key={nv._id} label={nv.fullname} value={nv._id} />
                                    ))}
                                </Picker>
                            </View>
                            <TextInput placeholder='Tên công việc' onChangeText={(txt) => settenCongViec(txt)} value={tenCongViec || ''} style={styles.input} />
                            <TextInput placeholder='Mô tả' onChangeText={(txt) => setmoTa(txt)} value={moTa || ''} style={styles.input} />

                            {showPicker &&
                                <DateTimePicker
                                    mode="date"
                                    display='spinner'
                                    value={date}
                                    onChange={onChange}
                                    // minimumDate={new Date()}
                                    style={styles.pickerIOS}
                                />}

                            {showPicker && Platform.OS === 'ios' && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity style={styles.button} onPress={toggleDatePicker}>
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={confirmIOSDate}>
                                        <Text>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            )}


                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text>Form Date</Text>
                                    {!showPicker && (
                                        <Pressable onPress={() => { toggleDatePicker(), setcheckForm(true) }}>
                                            <TextInput
                                                placeholder='Date'
                                                onChangeText={(txt) => setfromDate(txt)}
                                                value={fromDate || ''}
                                                style={[styles.input]}
                                                editable={false}
                                                onPressIn={toggleDatePicker} />
                                        </Pressable>
                                    )}
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text>To Date</Text>
                                    {!showPicker && (
                                        <Pressable onPress={() => { toggleDatePicker(), setcheckForm(false) }}>
                                            <TextInput
                                                placeholder='Date'
                                                onChangeText={(txt) => settoDate(txt)}
                                                value={toDate || ''}
                                                style={[styles.input]}
                                                editable={false}
                                                onPressIn={toggleDatePicker} />
                                        </Pressable>
                                    )}
                                </View>
                            </View>

                            {checkAdd ? null :
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>Trạng thái : </Text>
                                    <TouchableOpacity onPress={() => settrangThai(!trangThai)}
                                        style={[styles.button, { backgroundColor: !trangThai ? 'red' : 'green' }]}>
                                        <Text style={{ color: 'white' }}>
                                            {trangThai ? 'Đã làm' : 'Chưa làm'}
                                        </Text>
                                    </TouchableOpacity></View>}

                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Pressable
                                style={[styles.button]}
                                onPress={() => {
                                    setAddVisible(!AddVisible)
                                }}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button]}
                                onPress={() => { addCongViec() }}>
                                <Text style={styles.textStyle}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default CongViecScreen

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
    textStyle: {
        color: 'white'
    },
    crud: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#7F7F7F',
        padding: 10,
        marginBottom: 10,
        gap: 6
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
    btnAdd: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 40,
        bottom: 80,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    form: {
        width: '100%',
        gap: 12,
        marginVertical: 20
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#7F7F7F',
        paddingStart: 12
    },
    pickerIOS: {
        height: 120,
        marginTop: -10
    }
})