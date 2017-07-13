import { NativeModules } from 'react-native';
import { Asset } from 'expo';

//Help:
//Expo's Asset implementation
//  https://github.com/expo/expo-sdk/blob/master/src/Asset.js#L118-L144
//FileSystem NativeModules' implementation
//Android
//  https://github.com/expo/expo/blob/master/android/app/src/main/java/abi18_0_0/host/exp/exponent/modules/api/FileSystemModule.java
//iOS
//  https://github.com/expo/expo/blob/9a9dfb4103cb0cd5bfff8a97710350321655059f/ios/versioned-react-native/ABI18_0_0/Exponent/Modules/Api/ABI18_0_0EXFileSystem.m
//
//FileSystem support thread: https://github.com/expo/expo/issues/108
//
//inspired from https://github.com/expo/expo-docs/issues/63#issuecomment-305944573
//

/**
 * Download a remote asset to app cache or app data
 *
 * @param  {Boolean} cache
 *                    true: downloads asset to app cache
 *                    false: downloads asset to app data
 * @return {Promise}
 */
Asset.prototype.downloadAsyncWithoutHash = async function({ cache }) {
  const path = `${this.name}.${this.type}`;

  if (this.downloaded) {
    __DEV__ && console.log('asset already downloaded');
    return;
  }
  if (this.downloading) {
    __DEV__ && console.log('asset downloading');
    await new Promise((resolve, reject) =>
      this.downloadCallbacks.push({ resolve, reject })
    );
    return;
  }
  this.downloading = true;

  try {
    let exists, uri;
    ({
      exists,
      uri,
    } = await NativeModules.ExponentFileSystem.getInfoAsync(path, {
      //cache
      //  true: checks if file exists in app cache
      //  false: checks if file exists in app data
      cache, //shorthand for cache: cache
    }));

    if (__DEV__) {
      console.log(`${path} ${exists ? 'already downloaded':'not downloaded'}`);
      console.log('________________________');
      if (exists) {
        console.log(`filepath: ${uri
          .replace('file://', '')
          .replace(/%25/g,'%')
        }`);
      }
    }

    if (!exists) {
      __DEV__ && console.log('downloading it');
      ({
        uri,
      } = await NativeModules.ExponentFileSystem.downloadAsync(
        this.uri,
        path,
        {
          //cache
          //  true: stores file in app cache
          //  false: stores file in app data
          cache,  //shorthand for cache: cache
        }
      ));
    }
    this.localUri = uri;
    this.downloaded = true;
    this.downloadCallbacks.forEach(({ resolve }) => resolve());
  } catch (e) {
    this.downloadCallbacks.forEach(({ reject }) => reject(e));
    throw e;
  } finally {
    this.downloading = false;
    this.downloadCallbacks = [];
  }
}

export { Asset };
