import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';

const DichVuScreen = ({ navigation }) => {
  const [ListDichVu, setListDichVu] = useState([]);
  const [ListSearch, setListSearch] = useState([]);
  const [search, setsearch] = useState('')
  const [typeDichVu, settypeDichVu] = useState(0);

  const getListDichVu = async () => {
    const url = `${URL}/dichvus`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (typeDichVu == 0) {
        setListDichVu(data.data);
      } else if (typeDichVu == 1) {
        const listType = data.data.filter((item) => item.type == true);
        setListDichVu(listType);
      } else {
        const listType = data.data.filter((item) => item.type == false);
        setListDichVu(listType);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getListSearch = async () => {
    const url = `${URL}/dichvus/search?key=${search}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (typeDichVu == 0) {
        setListSearch(data.data);
      } else if (typeDichVu == 1) {
        const listType = data.data.filter((item) => item.type == true);
        setListSearch(listType);
      } else {
        const listType = data.data.filter((item) => item.type == false);
        setListSearch(listType);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <Pressable style={styles.card} onPress={() => { navigation.navigate('DichVuChiTiet', { item: item }) }}>
        <Image style={styles.cardImg} source={{ uri: item.hinhAnh }} />
        <Text style={styles.cardName}>{item.tenDichVu}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.cardPrice}>{formatPrice(item.giaTien)}</Text>
          <Text style={{ color: 'red', fontSize: 11 }}>Chi tiết</Text>
        </View>
      </Pressable>
    )
  }

  const formatPrice = (price) => {
    // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        getListDichVu();
        getListSearch();
      }, 1);
    });

    return unsubscribe;

  }, [search, typeDichVu, navigation]);

  useEffect(() => {
    getListDichVu();
    getListSearch();
  }, [search, typeDichVu]);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Image source={require('../assets/image/search.png')} style={styles.icon} />
        <TextInput
          placeholder='Search'
          style={{ marginStart: 10, marginEnd: 10, flex: 1 }}
          onChangeText={(txt) => setsearch(txt)} />
      </View>

      <View style={{ flexDirection: 'row', gap: 20, padding: 20 }}>
        <Text onPress={() => { settypeDichVu(0) }}
          style={{ color: typeDichVu == 0 ? 'orange' : 'black', fontWeight: 'bold' }}>All</Text>
        <Text onPress={() => { settypeDichVu(1) }}
          style={{ color: typeDichVu == 1 ? 'orange' : 'black', fontWeight: 'bold' }}>Đồ ăn/ Đồ uống</Text>
        <Text onPress={() => { settypeDichVu(2) }}
          style={{ color: typeDichVu == 2 ? 'orange' : 'black', fontWeight: 'bold' }}>Combo</Text>
      </View>

      <FlatList
      showsVerticalScrollIndicator={false}
        numColumns={2}
        data={ListSearch.length > 0 ? ListSearch : ListDichVu}
        keyExtractor={item => item._id}
        renderItem={renderItem} />

      <TouchableOpacity onPress={() => { navigation.navigate('AddUpdateDichVu', { item: null }) }}
        style={styles.btnAdd}>
        <Image source={require('../assets/image/add.png')} style={[styles.icon, { tintColor: 'white' }]} />
      </TouchableOpacity>
    </View>
  )
}

export default DichVuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
  },
  icon: {
    width: 24,
    height: 24
  },
  card: {
    width: '45%',
    padding: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    margin: 10,
    gap: 6,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowRadius: 20,
    shadowOpacity: 0.4,
    elevation: 9
  },
  cardImg: {
    width: '100%',
    height: 180,
    borderRadius: 6
  },
  cardName: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  cardPrice: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold'
  },
  search: {
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 10,
    margin: '5%'
  },
  btnAdd: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(222, 184, 135, 1.0)',
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
});
