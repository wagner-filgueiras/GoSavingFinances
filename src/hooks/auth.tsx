import React, {   
  createContext, 
  ReactNode,
  useContext, 
} from 'react';

import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
  children: ReactNode;
}

interface User{
  id: string;
  name: string;
  email: string
  photo?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps){
  const user = {
    id: '12345',
    name: 'Wagner Antonelli',
    email: 'wagner@antonelli.com'
  };

  // https://accounts.google.com/o/oauth2/v2/auth

  async function signInWithGoogle() {
    try {
      const CLIENT_ID = '353257427270-pt30q8qr0sce5n53sibe55cmen8674id.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@wagneraf/gofinances';
      const RESPONSE_TYPE = 'token';
      // encodeURI adiciona um caractere que a URI entende em vez desse espaco entre profile e email
      const SCOPE = encodeURI('profile email');

      //endpoint the autenticacao da google com os parametros que vai receber
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;


      const response = AuthSession.startAsync({ authUrl });
      console.log(response);

    } catch (error) {
      throw new Error(error);
    }

  }

  return(
    <AuthContext.Provider value={{ 
      user,
      signInWithGoogle 
      }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth}

