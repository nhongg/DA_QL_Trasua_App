import { useEffect, useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthNavigator from './navigator/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';

export default function App() {
  const [checkWelcome, setcheckWelcome] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setcheckWelcome(false);
    }, 2000);
    return () => clearTimeout(timeout)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0.3)'} />

      {checkWelcome
        ? <WelcomeScreen />
        : <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>}
    </View>
  );

}
