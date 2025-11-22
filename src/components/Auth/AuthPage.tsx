import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center mb-8 absolute top-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Karınca Kolonisi Yönetimi</h1>
        <p className="text-gray-600">Kolonilerinizi takip edin ve beslenme programları oluşturun</p>
      </div>
      <div className="mt-24">
        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
