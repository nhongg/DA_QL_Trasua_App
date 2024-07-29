import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./HomeScreen";

const RenderItem = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Image
        source={require("../assets/image/next2.png")}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export const getDataUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('User');
    if (userData !== null) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  } catch (error) {
    console.log('Lỗi : ', error);
  }
}

const OptionMenu = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dangXuatModal, setdangXuatModal] = useState(false)
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [userProfile, setuserProfile] = useState([])

  const newData = {
    fullname: fullName,
    username: username,
    password: password,
  };




  const resetData = () => {
    setFullName('')
    setUsername('')
    setPassword('')
  }
  const saveNV = async () => {
    try {
      if (username === '' || fullName === '' || password === "") {
        ToastAndroid.show('Vui lòng điền đầy đủ thông tin', ToastAndroid.SHORT);
      } else {
        const response = await fetch(`${URL}/nhanviens/post`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData),
        });
        const data = await response.json();


        if (data.status == 200) {
          ToastAndroid.show('Thêm nhân viên thành công', ToastAndroid.SHORT);
          resetData()
          setModalVisible(!modalVisible);
        } else if (data.status == 400) {
          ToastAndroid.show('Thêm nhân viên thất bại', ToastAndroid.SHORT);
          resetData()
        }
        else {
          ToastAndroid.show('Username tồn tại', ToastAndroid.SHORT);
          console.log(data.message);
        }
      }
    } catch (error) {
      console.error('Lỗi khi thực hiện yêu cầu:', error);
      ToastAndroid.show('Có lỗi xảy ra khi thêm nhân viên', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await getDataUser();
      setuserProfile(data);
    };
    loadData();
    
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../assets/image/back.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>OPTION</Text>
        <View />
      </View>
      <RenderItem
        icon={require("../assets/image/group.png")}
        title={"Danh sách nhân viên"}
        onPress={() => navigation.navigate("ListNhanVien")}
      />
      {userProfile.role==1?<RenderItem
        icon={require("../assets/image/add_user2.png")}
        title={"Thêm nhân viên mới"}
        onPress={() => setModalVisible(true)}
      />:null}
      <RenderItem
        icon={require("../assets/image/gust.png")}
        title={"Danh sách khách hàng"}
        onPress={() => navigation.navigate("KhachHangScreen")}
      />
      <RenderItem
        icon={require("../assets/image/job.png")}
        title={"Công việc"}
        onPress={() => navigation.navigate("CongViecScreen")}
      />
      <RenderItem
        icon={require("../assets/image/logout.png")}
        title={"Đăng xuất"}
        onPress={() => {
          setdangXuatModal(true)

        }}
      />

      {/* Dialog add nhân viên */}
      <Modal
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
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
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Thêm nhân viên mới
            </Text>

            <View style={styles.khachHang}>
              <View style={{ gap: 5, marginTop: 10 }}>
                <TextInput
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    width: "100%",
                  }}
                  value={fullName}
                  onChangeText={(txt) => setFullName(txt)}
                  placeholder="Họ tên nhân viên"
                />
                <TextInput
                  value={username.toLocaleLowerCase().trim()}
                  onChangeText={(txt) => setUsername(txt)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    width: "100%",
                  }}
                  placeholder="Username"
                />
                <TextInput
                  value={password.toLocaleLowerCase().trim()}
                  onChangeText={(txt) => setPassword(txt)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    width: "100%",
                  }}
                  placeholder="Password"
                />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible),
                    resetData()
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => { saveNV() }}
              >
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
        animationType='slide'
        transparent={true}
        visible={dangXuatModal}
      >
        <View style={styles.cardCotainer}>
          <View style={styles.cardModal}>
            <Text style={styles.textModal}>
              Bạn có chắc chắn muốn đăng xuất không?
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setdangXuatModal(!dangXuatModal)
                }}>

                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  {
                    setdangXuatModal(!dangXuatModal)
                    navigation.navigate('LoginScreen')
                  }


                }
                }>
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
};

export default OptionMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 30,
    marginBottom: 10,
  },
  khachHang: {
    justifyContent: "space-around",
    width: "100%",
  },
  item: {
    width: "100%",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(222, 184, 135, 1.0) ",
    borderRadius: 14,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 100,
    margin: 10,
    alignItems: "center",
  },
  textStyle: {
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
});
