import { Video } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, NativeModules } from 'react-native';
import { Asset } from './enhancedAsset';

/**
 * Example for downloading a remote video, storing/caching it (available offline)
 * then playing it with Expo
 *
 * sdkVersion: 18
 */
export default class App extends React.Component {
  state = {
    appIsReady: false,
    video: null,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    const videoAsset = new Asset({
      name: 'big_buck_bunny',
      type: 'mp4',
      // path to the file somewhere on the internet
      uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    });

    this.setState({ video: videoAsset });

    try {
      //As the file is remote, we can't calculate its hash beforehand
      //so we download it without hash
      //downloadAsyncWithoutHash in enhancedAsset.js
      /**
       * @type {Boolean} cache
       *                    true: downloads asset to app cache
       *                    false: downloads asset to app data
       */
      await videoAsset.downloadAsyncWithoutHash({ cache: true });
      // console.log(videoAsset);
      this.setState({ video: videoAsset });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    }
    finally {
      this.setState({ appIsReady: true });
    }
  }

  renderContent() {
    if (!this.state.appIsReady) {
      if (!this.state.video) {
        return <View />;
      }

      return <Text>Downloading {this.state.video.uri}</Text>;
    }

    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.state.video.localUri }}
          style={{
            height: 240,
            width: 320,
          }}
          onLoad={params => {
            // console.log(params);
          }}
          onError={e => {
            console.log(e);
          }}
          shouldPlay
        />
        <Text>
          Video saved at the following path:
        </Text>
        <Text>
          {
            this.state.video &&
            this.state.video.localUri
            .replace('file://', '')
            .replace(/%25/g,'%')
          }
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
