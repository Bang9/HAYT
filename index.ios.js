import { AppRegistry} from 'react-native';
import App from './src/scene/Index'
import SplashScreen from 'react-native-splash-screen'

SplashScreen.show()
AppRegistry.registerComponent('HAYT', () => App);