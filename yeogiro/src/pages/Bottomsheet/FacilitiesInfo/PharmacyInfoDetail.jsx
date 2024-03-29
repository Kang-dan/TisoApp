import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import Config from 'react-native-config';
import axios from 'axios';
import {Linking} from 'react-native';
import {useRecoilState} from 'recoil';
import {pharmacyState} from '../../../state/atoms'; 
import {selectedPharmacyIdState} from '../../../state/selectedAtom'; 
import {useFocusEffect} from '@react-navigation/native';

const KAKAO_API_KEY = Config.KAKAO_MAP_API_KEY;

const headers = {
  Authorization: `KakaoAK ${KAKAO_API_KEY}`,
};

async function requestPermissions() {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  console.log('내 위치');
}

async function fetchPharmacies(latitude, longitude) {
  console.log('fetch함수실행');
  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=PM9&x=${longitude}&y=${latitude}`,
      {headers},
    );
    console.log('API 요청보냄');
    return response.data.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const PharmacyInfoDetail = ({navigation}) => {
  const [selectedPharmacyId, setSelectedPharmacyId] = useRecoilState(
    selectedPharmacyIdState,
  );
  const [pharmacies, setPharmacies] = useRecoilState(pharmacyState);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '약국 정보',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setPharmacies([]);
      };
    }, [setPharmacies]),
  );

  useEffect(() => {
    requestPermissions().then(() => {
      Geolocation.getCurrentPosition(
        async position => {
          console.log('위도 경도 저장');
          const {latitude, longitude} = position.coords;
          console.log(latitude, longitude);
          const pharmaciesData = await fetchPharmacies(latitude, longitude);
          setPharmacies(pharmaciesData);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    });
  }, []);

  const renderPharmacy = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => setSelectedPharmacyId(item.id)}>
      <View>
        <Text style={styles.title}>{item.place_name}</Text>
        <Text style={styles.address}>
          {item.road_address_name || item.address_name}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
          <Text style={styles.phone}>{item.phone}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navigatorContainer}>
        <TouchableOpacity>
          <Image
            source={require('../../../../assets/icons/Navigator.png')}
            style={styles.navigatorImage}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pharmacies}
        renderItem={renderPharmacy}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  phone: {
    fontSize: 14,
    color: '#007bff',
  },
  navigatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigatorImage: {
    width: 40,
    height: 40,
  },
});

export default PharmacyInfoDetail;
