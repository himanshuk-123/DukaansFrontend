import React from 'react'
import { StatusBar,Platform,View } from 'react-native'
import RootNavigator from './src/navigation/RootNavigator'
const App = () => {
  return (
    <>
     {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: '#0b0866' }} />
      )}
      <StatusBar 
        backgroundColor="#0b0866" 
        style="light" 
        barStyle={"light-content"} 
        hidden={false} 
        translucent={true} 
      />
      <RootNavigator />
    </>
  )
}

export default App