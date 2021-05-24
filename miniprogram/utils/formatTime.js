export function timeformat(time) {
  if (time.length === 14) {
    return (time || '').slice(0, 4) + '-' + (time || '').slice(4, 6) + '-' + (time || '').slice(6, 8) + ' ' + (time || '').slice(8, 10) + ':' + (time || '').slice(10, 12) + ':' + (time || '').slice(12, 14)
  } else if (time.length === 8) {
    return (time || '').slice(0, 4) + '-' + (time || '').slice(4, 6) + '-' + (time || '').slice(6, 8)
  } else if (time.length === 6) {
    return (time || '').slice(0, 4) + '-' + (time || '').slice(4, 6)
  }
}