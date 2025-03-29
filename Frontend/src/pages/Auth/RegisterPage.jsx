import React from 'react';
import RegisterForm from '../../Components/Register';
import AuthCardLeft from '../../Components/AuthCardLeft';
import AuthCardRight from '../../Components/AuthCardRight';
import AuthContainer from '../../Components/AuthContainer';

function RegisterPage() {
  return (
    <AuthContainer>
      <AuthCardLeft />
      <AuthCardRight 
        title="Create Account" 
        subtitle="Sign up to get started with FinTrack" 
        footerText="Already have an account?" 
        linkText="Login" 
        linkTo="/login"
      >
        <RegisterForm />
      </AuthCardRight>
    </AuthContainer>
  );
}

export default RegisterPage;