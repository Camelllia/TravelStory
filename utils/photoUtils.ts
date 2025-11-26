// 날짜와 위치별로 사진 그룹핑 (샘플)
export function groupPhotosByDateAndLocation(photos: any[]) {
  if (!photos || photos.length === 0) return [];
  const map = new Map<string, any[]>();
  photos.forEach(photo => {
    let label =
      photo.exif?.DateTimeOriginal?.split(' ')[0] ||
      photo.creationTime?.split('T')[0] ||
      photo.modificationTime?.split('T')[0] ||
      photo.filename?.split('_')[0] ||
      null;
    if (!label || label === 'N/A') label = '날짜 정보 없음';
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(photo);
  });
  return Array.from(map.entries()).map(([label, photos]) => ({ label, photos }));
}

// 베스트컷 추출 (가장 해상도 큰 사진 기준)
export function selectBestShots(groups: any[]) {
  if (!groups || groups.length === 0) return [];
  return groups.map(group => {
    let best = group.photos[0];
    group.photos.forEach(photo => {
      if ((photo.width || 0) * (photo.height || 0) > (best.width || 0) * (best.height || 0)) {
        best = photo;
      }
    });
    return best;
  });
}
