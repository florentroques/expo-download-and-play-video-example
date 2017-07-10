# Expo download and play video - example
[Try on Expo](https://expo.io/@florentroques/expo-download-and-play-video)

Example for a workaround (with undocumented FileSystem API for now) to
1. download a remote video
2. store/cache it
3. play it 

**Expo SDK version at the time of the example**: 18

### Help:  
[Asset.js](https://github.com/expo/expo-sdk/blob/master/src/Asset.js)
 
**FileSystem NativeModules implementations:**  
[Android](https://github.com/expo/expo/blob/master/android/app/src/main/java/abi18_0_0/host/exp/exponent/modules/api/FileSystemModule.java)
| [iOS](https://github.com/expo/expo/blob/9a9dfb4103cb0cd5bfff8a97710350321655059f/ios/versioned-react-native/ABI18_0_0/Exponent/Modules/Api/ABI18_0_0EXFileSystem.m)

[FileSystem support thread](https://github.com/expo/expo/issues/108)  
inspired from this [snippet](https://github.com/expo/expo-docs/issues/63#issuecomment-305944573)

thanks to @astonm and @nikki93
