import { useCallback, useState, useEffect } from 'react';
import { Text, View, ScrollView, Button, Linking, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export function Home() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [text, setText] = useState('Not yet scanned')

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status == 'granted')
    })()
  }

  //REQUEST CAMERA PERMISSION
  useEffect(() => {
    askForCameraPermission()
  }, [])

  // WHAT HAPPENS AFTER SCANNING THE CODE
  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true)
    setText(data)
    console.log('Type: ' + type + '\nData: ' + data)
  }

  //CHECK PERMISSIONS AND RETURN THE SCREENS
  if (hasPermission === null) {
    return (
      <View className='flex-1 bg-background px-8 pt-16'>
        <Text className='text-zinc-100'>Requesting for camera permission</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View className='flex-1 bg-background px-8 pt-16'>
        <Text className='text-zinc-100 m'>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>
    )
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16 items-center'>
      <View className='bg-zinc-100 w-full h-72 overflow-hidden rounded-xl items-center justify-center border border-red-500'>
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ width: 400, height: 400 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, marginTop: 32 }}
      >
        <Text className='text-lg text-emerald-500 ' onPress={() => Linking.openURL(text)}>{text}</Text>
      </ScrollView>
      {scanned &&
        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-red-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={() => setScanned(false)}
        >
          <Text className="font-semibold text-base text-white ml-2">
            Scan Again?
          </Text>
        </TouchableOpacity>
      }
    </View>
  )
} 