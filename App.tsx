import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';

import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
 } from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import { Register } from './src/screens/Register';


export default function App() {
  // carregar as fontes
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  // Enquanto as fontes nao carregaram segurar o app no splash page.
  if(!fontsLoaded) {
    return <AppLoading />
  }
  return (
    <ThemeProvider theme={theme}>
      <Register />
    </ThemeProvider>
  )  
}