import React from 'react';
import LoginForm from '../../Components/Login';
import AuthCardLeft from '../../Components/AuthCardLeft';
import AuthCardRight from '../../Components/AuthCardRight';
import AuthContainer from '../../Components/AuthContainer';

function LoginPage() {
  return (
    <AuthContainer>
      <AuthCardLeft />
      <AuthCardRight 
        title="Welcome Back" 
        subtitle="Sign in to continue to FinTrack" 
        footerText="Don't have an account?" 
        linkText="Register" 
        linkTo="/register"
      >
        <LoginForm />
      </AuthCardRight>
    </AuthContainer>
  );
}

export default LoginPage;