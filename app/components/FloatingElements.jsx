"use client";

import React from 'react';

const FloatingElements = () => {
  return (
    <>
      {/* Background Gradient Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-cyan-100/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Animated floating elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-300/30 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-indigo-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-300/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 right-1/4 w-5 h-5 bg-purple-300/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
    </>
  );
};

export default FloatingElements;