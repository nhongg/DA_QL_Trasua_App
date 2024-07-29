import { ActivityIndicator, Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit'
import { URL } from './HomeScreen'

export const Month = ['Jan', 'Fer', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DataFake = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


const ThongKeScreen = ({ navigation }) => {

  const [loading, setloading] = useState(true);

  const [TongDoanhThu, setTongDoanhThu] = useState('');
  const [TongDoanhThuYear, setTongDoanhThuYear] = useState('');
  const [TongKhachHang, setTongKhachHang] = useState('');
  const [TongHoaDon, setTongHoaDon] = useState('');
  const [TongHoaDonOk, setTongHoaDonOk] = useState('');
  const [TongHoaDonFail, setTongHoaDonFail] = useState('');
  const [TongHoaDonLoad, setTongHoaDonLoad] = useState('');
  const [DoanhThuInMonth, setDoanhThuInMonth] = useState([]);
  const [getMonth, setgetMonth] = useState([]);

  const [SoLieu, setSoLieu] = useState([])
  const [year, setyear] = useState(new Date().getFullYear())

  const getDoanhThuInMonth = async () => {
    const url = `${URL}/thongke/doanhthu-in-month?year=${year}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status == 200) {
      const DoanhThuInYear = data.data;
      const DoanhThuMonth = DoanhThuInYear.map((monthData) => {
        return Number(String(monthData.map((index) => index.totalRevenue / 1000)));
      });
      const totalRevenue = DoanhThuInYear.map((month)=> {
        return Number(String(month.map((index) => index.totalRevenue)));
      });
      // console.log(totalRevenue);

      let doanhThuOfYear = 0;
      for(let i = 0; i < totalRevenue.length; i++){
        doanhThuOfYear += totalRevenue[i];
      };
      console.log(doanhThuOfYear);
      setTongDoanhThuYear(doanhThuOfYear);
      // setDoanhThuInMonth(DoanhThuMonth.filter(i => i > 0));
      setDoanhThuInMonth(DoanhThuMonth);

      const month = [];

      for (let i = 0; i < DoanhThuMonth.length; i++) {
        month.push(Month[i])
        // if (DoanhThuMonth[i] > 0) {
        //   month.push(Month[i])
        // }
      }
      setgetMonth(month);
    }
  }

  // hàm format price
  const formatPrice = (price) => {
    // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const getThongKe = async () => {
    const url = `${URL}/thongke/doanhthu-thongso?year=${year}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status == 200) {
      const tk = data.data;
      setTongHoaDon(tk.TongHoaDon);
      setTongHoaDonOk(tk.TongHoaDonOK);
      setTongHoaDonFail(tk.TongHoaDonFail);
      setTongHoaDonLoad(tk.TongHoaDonLoad);
      setTongKhachHang(tk.TongSoKhachHang);
      setTongDoanhThu(tk.Tongtien);
      setSoLieu(tk.ThongKeByMonth);
      setloading(false);
      console.log(SoLieu);
    }
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // cập nhật giao diện ở đây
      getDoanhThuInMonth();
      getThongKe();
    });

    return unsubscribe;
  }, [navigation]);
  
  useEffect(() => {
    getDoanhThuInMonth();
    getThongKe()
  }, [year]);

  const renderSoLieu = ({ item }) => {
    return (
      <View style={{ marginTop: 10, padding: 20, borderWidth: 1, borderRadius: 8, width: '94%', marginHorizontal: 12 }}>
        <Text>Tháng {item._id.month} / {item._id.year}</Text>
        <Text>Có {item.TongSoKhachHang.length} khách hàng mua {item.TongHoaDon} hóa đơn
          {'\n'}Doanh thu {formatPrice(item.TongTien)}</Text>
      </View>
    )
  }


  const DoanhThuLineChart = () => {
    return (
      <>
        <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>Biểu đồ doanh thu theo năm {'\n'}
          <Text style={{ fontSize: 10, fontStyle: 'italic' }}> (tỉ giá: 1/1000 VNĐ)</Text>
        </Text>
        <LineChart
          data={{
            labels: getMonth.length != 0 ? getMonth : Month,
            datasets: [{
              data: DoanhThuInMonth.length != 0 ? DoanhThuInMonth : DataFake,
            },],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          chartConfig={{
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'rgba(222, 184, 135, 1.0)',
            decimalPlaces: 1,
            color: (opacity = 255) => `rgba(0,0,0,${opacity})`
          }}
          bezier // uốn công
          style={{ borderRadius: 16, marginVertical: 20 }}
        />
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', width: '100%', padding: 4, justifyContent: 'center', marginBottom: 15 }}>
          <TouchableOpacity onPress={() => setyear(year - 1)}>
            <Image source={require('../assets/image/back2.png')} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
          <Text>{year}</Text>
          <TouchableOpacity onPress={() => setyear(year + 1)}>
            <Image source={require('../assets/image/next2.png')} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
        </View>

      </>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.doanhThu, { color: 'green' }]}>Tổng doanh thu: {loading ? 0 : formatPrice(TongDoanhThu)}</Text>


          <View style={{ padding: 10, gap: 20, marginVertical: 20 }}>
            <View style={{ padding: 30, gap: 10, borderRadius: 10, borderWidth: 1 }}>
              <Text style={styles.doanhThu}>Thông số</Text>
              <Text style={styles.text}>Tổng hóa đơn                                                  {loading ? 0 : TongHoaDon}</Text>
              <Text style={styles.text}>Hóa đơn hoàn thành                                      {loading ? 0 : TongHoaDonOk}</Text>
              <Text style={styles.text}>Hóa đơn đang chờ                                           {loading ? 0 : TongHoaDonLoad}</Text>
              <Text style={styles.text}>Hóa đơn đã hủy                                                {loading ? 0 : TongHoaDonFail}</Text>
              <Text style={styles.text}>Tổng số khách                                                {loading ? 0 : TongKhachHang}</Text>
            </View>
          </View>

          <DoanhThuLineChart />
          <Text style={[styles.doanhThu, { fontSize: 15 }]}>
            Doanh thu năm {year} : <Text style={{color: 'red', textDecorationLine: 'underline' }}>{loading ? 0 : formatPrice(TongDoanhThuYear)}</Text></Text>

          {loading ? <ActivityIndicator color={'black'} />
            :
            <View style={{marginTop: 30}}>
              <Text style={styles.doanhThu}>Số liệu thống kê theo tháng</Text>
              <FlatList
                scrollEnabled={false}
                data={SoLieu}
                renderItem={renderSoLieu}></FlatList>
            </View>}

        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ThongKeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
  },
  text: {
    textDecorationLine: 'underline'
  },
  doanhThu: { textAlign: 'center', fontSize: 18, fontWeight: 'bold' }
})