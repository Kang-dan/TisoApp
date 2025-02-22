import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const {width: screenWidth} = Dimensions.get('window');
const buttonWidth = (screenWidth - 40) / 2;

const disasterList = [
  {id: '1', title: '전기사고', api: 'D11', videoId: 'Q4LePrtMeZ0'},
  {id: '2', title: '가스사고', api: 'D12', videoId: 'rZpRUVnXRW0'},
  {id: '3', title: '산불', api: 'D13', videoId: '3eK54e_IIs8'},
  {id: '4', title: '건축물 붕괴', api: 'D14', videoId: '8wjZ1l_a43M'},
];

function EmergencyEvacuation({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '사회 재난',
      headerTitleStyle: {
        fontSize: 20,
        fontFamily: 'Pretendard-ExtraBold',
        marginBottom: 5,
      },
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.item, {marginLeft: 5, marginRight: 5}]}
      onPress={() =>
        navigation.navigate('SafetyGuidelineDetail', {
          title: item.title,
          api: item.api,
          videoId: item.videoId,
        })
      }>
      <Text style={styles.title}>{item.title}</Text>
      <Image
        source={require('../../../../../assets/icons/Next.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={[
            'rgba(255,255,255, 0.01)',
            'rgba(255,255,255,1)',
          ]}
          style={styles.gradient}
        />

        <Image
          source={require('../../../../../assets/images/SocialDisaster.jpg')}
          style={styles.headerImage}
        />
      </View>

      <FlatList
        data={disasterList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.flatList}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  flatList: {
    padding: 10,
  },
  flatListContent: {
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderColor: '#E9E9E9',
    borderWidth: 2,
    borderRadius: 8,
    width: buttonWidth,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Pretendard-SemiBold',
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: 290,
  },
  imageContainer: {
    marginBottom: 10,
  },
  headerImage: {
    height: 280,
    resizeMode: 'contain',
    zIndex: -1,
  },
});

export default EmergencyEvacuation;
