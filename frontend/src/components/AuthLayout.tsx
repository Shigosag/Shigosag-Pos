import React, { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4338ca] relative overflow-hidden p-4">
      {/* Flower Effect: Abstract Indigo Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-400 rounded-full blur-[100px] opacity-[0.4]"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.57 13.43-30 30-30v60c-16.57 0-30-13.43-30-30z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
