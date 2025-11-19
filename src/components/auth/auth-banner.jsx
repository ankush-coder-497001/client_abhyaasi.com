'use client';

import './styles/auth-banner.css';



export default function AuthBanner({ mode }) {
  const content = {
    login: {
      title: 'Welcome Back, Learner',
      description: 'Sign in to continue your learning journey, track progress, and access personalized modules.',
      highlight: 'Focused • Fast • Seamless',
    },
    signup: {
      title: 'Start Your Learning Journey',
      description: 'Create your account and unlock structured courses, AI-driven study tools, and personalized learning paths.',
      highlight: 'Learn • Grow • Excel',
    },
    forgot: {
      title: 'Reset Your Access',
      description: 'Enter your registered email and we’ll help you securely recover your learning account.',
      highlight: 'Secure • Quick • Reliable',
    },
  };


  const current = content[mode];

  return (
    <div className="auth-banner">
      <div className="banner-gradient"></div>

      <div className="banner-content ">
        <div className='w-full flex items-center justify-center' >
          <div className="banner-logo">
            <div className="logo-mark">Abhyaasi.com</div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center' >
          <h2 className="banner-title text-center">{current.title}</h2>
          <p className="banner-description">{current.description}</p>
          <div className="banner-features">
            <p className="banner-highlight">{current.highlight}</p>
          </div>
        </div>

        <div className="banner-decorative">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
          <div className="deco-circle deco-3"></div>
        </div>
      </div>
    </div>
  );
}
