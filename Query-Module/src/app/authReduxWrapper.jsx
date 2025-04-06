'use client'

import React from 'react'
import { AuthProvider } from '../hooks/useAuth';
import { Provider } from 'react-redux';
import { store } from '../lib/redux/store';
// import { ReduxProvider } from '@/lib/provider';
import { useGetUserQuery } from '@/lib/redux/authApi';

function AuthInitializer() {
  useGetUserQuery(); // Automatically fetches user on page load
  return null;
}


const AuthWrapper = ({children}) => {
  return (
    <Provider store={store}>
    {/* <AuthProvider> */}
    <AuthInitializer/>
        {children}
    {/* </AuthProvider> */}
    </Provider>
  )
}

export default AuthWrapper