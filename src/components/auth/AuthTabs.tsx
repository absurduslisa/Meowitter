'use client';
import Tabs from '@/components/ui/Tabs';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthTabs() {
  const tabs = [
    {
      label:       'Login',
      content:     <LoginForm />,
    },
    {
      label:       'Sign Up',
      content:     <RegisterForm />,
    },
  ];

  return <Tabs tabs={tabs} />;
}