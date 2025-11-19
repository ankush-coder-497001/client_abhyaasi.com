'use client';

import { BookOpen, Brain, Code2, Briefcase, Award, Settings, LogOut, Home } from 'lucide-react';

export default function LeftNavbar() {
  return (
    <div className="w-20 bg-black border-r border-gray-900 flex flex-col items-center py-6 space-y-1 fixed left-0 top-0 h-screen">
      {/* Logo */}
      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-8 hover:bg-blue-700 transition-colors cursor-pointer">
        <span className="text-white font-bold text-lg">L</span>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-3">
        <NavIconButton icon={Home} label="Dashboard" active />
        <NavIconButton icon={BookOpen} label="Modules" />
        <NavIconButton icon={Brain} label="Learn" />
        <NavIconButton icon={Code2} label="Code" />
        <NavIconButton icon={Briefcase} label="Projects" />
        <NavIconButton icon={Award} label="Progress" />
      </nav>

      {/* Bottom Section */}
      <div className="flex-1 flex flex-col items-center justify-end space-y-3">
        <NavIconButton icon={Settings} label="Settings" />
        <NavIconButton icon={LogOut} label="Logout" />
      </div>
    </div>
  );
}

function NavIconButton({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:bg-gray-900 group relative ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      title={label}
    >
      <Icon className="w-5 h-5" />
      <div className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
}
