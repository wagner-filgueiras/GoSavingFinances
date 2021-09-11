import React from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

export function SignIn() {
  const {signInWithGoogle} = useAuth();

  async function handleSignInWithGoogle(){
    try {
      await signInWithGoogle();

    } catch (error) {
      console.log(error);
      Alert.alert('Sorry we cannot connect to your Google account at this time');
    }
  }
  

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(70)}
          />

          <Title>
            Keep track of {'\n'}
            your finances {'\n'}
            ea$ily
          </ Title>
        </TitleWrapper>

        <SignInTitle>
          Log in using {'\n'}
          one option below
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
            title="Login with Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
           <SignInSocialButton 
            title="Login with Apple"
            svg={AppleSvg}
          />
        </FooterWrapper>
      </Footer>
    </Container>
  )
}