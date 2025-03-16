import React from 'react';
import AuthCardLeft from '../../Components/AuthCardLeft';
import AuthCardRight from '../../Components/AuthCardRight';
import RegisterForm from '../../Components/Register';

function RegisterPage() {
  return (
    <div className="flex h-screen w-full">
      <AuthCardLeft />
      <AuthCardRight 
        title="Create Account"
        subtitle="Join thousands of users managing their finances"
        footerText="Already have an account?"
        linkText="Sign in"
        linkTo="/login"
      >
        <RegisterForm />
      </AuthCardRight>
    </div>
  );
}

export default RegisterPage;