import React, { useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { groupPhotosByDateAndLocation, selectBestShots } from '@/utils/photoUtils';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [bestShots, setBestShots] = useState<any[]>([]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('사진 접근 권한이 필요합니다');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
      quality: 1,
    });
    if (!result.canceled) {
      // 기존 사진과 누적
      const newAssets = (Array.isArray(result.assets) ? result.assets : [result.assets]);
      setPhotos(prev => [...prev, ...newAssets]);
      // 항상 전체 배열에 대해 그룹핑, 베스트컷 재계산
      const allPhotos = [...photos, ...newAssets];
      const grouped = groupPhotosByDateAndLocation(allPhotos);
      setGroups(grouped);
      setBestShots(selectBestShots(grouped));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title={Platform.OS === 'web' ? "사진 불러오기(여러 장 지원)" : "사진 불러오기(1장씩 여러번 누르기)"} onPress={pickImages} />
      <Text style={styles.title}>날짜/장소별 그룹</Text>
      <FlatList
        data={groups}
        keyExtractor={(_, idx) => idx + ''}
        renderItem={({ item }) => (
          <View style={styles.group}>
            <Text>{item.label}</Text>
            <FlatList
              horizontal
              data={item.photos}
              keyExtractor={photo => photo.uri}
              renderItem={({ item: photo }) => (
                <Image source={{ uri: photo.uri }} style={styles.image} />
              )}
            />
          </View>
        )}
      />
      <Text style={styles.title}>AI 베스트컷 (샘플)</Text>
      <FlatList
        horizontal
        data={bestShots}
        keyExtractor={photo => photo.uri}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.imageLarge} />
        )}
      />
      {/* PDF/스토리북 관련 기능 모두 제거됨 */}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 24, fontSize: 18, fontWeight: 'bold' },
  group: { marginVertical: 8 },
  image: { width: 80, height: 80, margin: 4, borderRadius: 10 },
  imageLarge: { width: 150, height: 150, margin: 8, borderRadius: 18 },
});
