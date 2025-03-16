import React from 'react';
import AuthCardLeft from '../../Components/AuthCardLeft';
import AuthCardRight from '../../Components/AuthCardRight';
import LoginForm from '../../Components/Login';

function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      <AuthCardLeft />
      <AuthCardRight 
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
        footerText="Don't have an account?"
        linkText="Register now"
        linkTo="/register"
      >
        <LoginForm />
      </AuthCardRight>
    </div>
  );
}

export default LoginPage;