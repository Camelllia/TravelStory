import React from 'react';
import { Button, View, Alert } from 'react-native';
import { generateTravelStorybookPDF } from '@/utils/pdfGenerator';

export default function StorybookPreview({ groups, bestShots, metaNotes = [] }) {
  const savePDF = async () => {
    try {
      const pdf = generateTravelStorybookPDF(groups, bestShots, metaNotes);
      pdf.save('travel_storybook.pdf');
      Alert.alert('PDF 저장', '여행 앨범 PDF가 생성되었습니다! (플랫폼에 따라 저장 위치 상이)');
    } catch (e) {
      Alert.alert('오류', String(e));
    }
  };
  return (
    <View style={{ margin: 20 }}>
      <Button title="여행 스토리북 PDF 저장" onPress={savePDF} />
    </View>
  );
}
