import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, imageSrc }) => (
  <div className="flex h-screen overflow-hidden">
    <div className="flex-1 flex justify-center items-center p-4 md:p-8">
      {children}
    </div>
    <div className="hidden lg:flex flex-1">
      <img 
        src={imageSrc} 
        alt="Authentication" 
        className="object-cover w-full h-full" 
      />
    </div>
  </div>
);

export default AuthLayout;
