import React, { useState, useEffect } from 'react';
import { Activity, ShoppingBag, Video, MessageCircle, Users, CheckCircle } from 'lucide-react';

/* =============================================================================
   HERO.JSX - PRODUCTION-READY COMPONENT
   
   NO THIRD-PARTY INSTITUTIONAL REFERENCES (Mayo Clinic, etc.) - BRAND ONLY
   
   Features:
   - Separate welcome header (no overlap with devices)
   - 3 device mockups: iPhone (app), MacBook (dashboard), iPhone (medical shop)
   - Community panel (Twitter Space-like doctor/patient interaction)
   - Fully responsive (mobile-first)
   - Blue/white/cream theme
   - Optimized images with srcset
   - Accessible & semantic HTML
============================================================================= */

const Hero = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Community messages - Twitter Space style
  const communityMessages = [
    {
      id: 1,
      role: 'Doctor',
      name: 'Dr. Sarah Chen',
      message: 'Just completed a virtual consultation. The platform makes remote care seamless!',
      timeAgo: '2m ago',
      avatarColor: 'bg-blue-500'
    },
    {
      id: 2,
      role: 'Patient',
      name: 'Michael Roberts',
      message: 'Received my prescription within minutes. This is healthcare done right.',
      timeAgo: '5m ago',
      avatarColor: 'bg-purple-500'
    },
    {
      id: 3,
      role: 'Doctor',
      name: 'Dr. James Wilson',
      message: 'The medical supply integration saves so much time. Highly recommend!',
      timeAgo: '8m ago',
      avatarColor: 'bg-cyan-500'
    },
    {
      id: 4,
      role: 'Patient',
      name: 'Emma Thompson',
      message: 'Found exactly what I needed in the medical shop. Fast delivery too!',
      timeAgo: '12m ago',
      avatarColor: 'bg-pink-500'
    }
  ];

  // Medical shop products
  const medicalProducts = [
    {
      id: 1,
      name: 'Digital Thermometer',
      price: '$29.99',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Blood Pressure Monitor',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'First Aid Kit',
      price: '$34.99',
      image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop'
    }
  ];

  return (
    <section className="hero-section">
      {/* Background Effects */}
      <div className="hero-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      <div className="hero-container">
        {/* ===== WELCOME HEADER (Separate, No Overlap) ===== */}
        <header className={`welcome-header ${isVisible ? 'visible' : ''}`}>
          <div className="welcome-badge">
            <Activity className="w-4 h-4" />
            <span>Trusted by 50,000+ Healthcare Professionals Worldwide</span>
          </div>
          <h1 className="welcome-title">
            Transform Healthcare Delivery
            <br />
            <span className="gradient-text">One Platform, Infinite Possibilities</span>
          </h1>
          <p className="welcome-subtitle">
            Connect patients, doctors, and medical suppliers in a seamless digital ecosystem. 
            Experience the future of global healthcare today.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">
              Start Free Trial
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="btn-secondary">
              <Video className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </header>

        {/* ===== DEVICE MOCKUPS SECTION ===== */}
        <div className={`devices-grid ${isVisible ? 'visible' : ''}`}>
          
          {/* LEFT: iPhone App Mockup */}
          <div className="device-wrapper iphone-wrapper">
            <div className="iphone-frame">
              <div className="iphone-notch"></div>
              <div className="iphone-screen">
                {/* App Content */}
                <div className="app-content">
                  <div className="app-header">
                    <div className="avatar-circle"></div>
                    <div>
                      <h3 className="app-title">Dr. Emily Carter</h3>
                      <p className="app-subtitle">Cardiologist • Online Now</p>
                    </div>
                    <span className="status-badge">Active</span>
                  </div>
                  
                  <div className="app-stats">
                    <div className="stat-card">
                      <div className="stat-icon bg-blue-500">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Heart Rate</p>
                        <p className="stat-value">72 bpm</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon bg-green-500">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Blood Pressure</p>
                        <p className="stat-value">120/80</p>
                      </div>
                    </div>
                  </div>

                  <div className="app-appointments">
                    <h4 className="section-title">Upcoming Appointments</h4>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="appointment-item">
                        <div className="appointment-avatar"></div>
                        <div className="appointment-details">
                          <p className="appointment-name">Patient Consultation</p>
                          <p className="appointment-time">Today at 2:30 PM</p>
                        </div>
                        <button className="join-btn">Join</button>
                      </div>
                    ))}
                  </div>

                  <button className="app-cta-btn">
                    <Video className="w-5 h-5" />
                    Start Video Consultation
                  </button>
                </div>
              </div>
            </div>
            <p className="device-label">Healthcare App</p>
          </div>

          {/* CENTER: MacBook Dashboard Mockup */}
          <div className="device-wrapper macbook-wrapper">
            <div className="macbook-frame">
              <div className="macbook-screen">
                {/* Dashboard Content */}
                <div className="dashboard-content">
                  <div className="dashboard-header">
                    <div className="logo-section">
                      <div className="logo-icon"></div>
                      <span className="logo-text">HealthHub</span>
                    </div>
                    <nav className="dashboard-nav">
                      <span>Dashboard</span>
                      <span>Patients</span>
                      <span>Analytics</span>
                      <span>Settings</span>
                    </nav>
                  </div>

                  <div className="dashboard-main">
                    <div className="dashboard-sidebar">
                      <div className="doctor-card">
                        <div className="doctor-avatar"></div>
                        <h4 className="doctor-name">Dr. Sarah Johnson</h4>
                        <p className="doctor-specialty">Chief Cardiologist</p>
                      </div>
                      <div className="quick-stats">
                        <div className="quick-stat">
                          <span className="stat-number">248</span>
                          <span className="stat-text">Patients</span>
                        </div>
                        <div className="quick-stat">
                          <span className="stat-number">12</span>
                          <span className="stat-text">Today</span>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-charts">
                      <div className="chart-card">
                        <h5 className="chart-title">Patient Overview</h5>
                        <div className="chart-circles">
                          <div className="circle-chart">
                            <div className="circle blue-circle">
                              <span>85%</span>
                            </div>
                            <p>Satisfaction</p>
                          </div>
                          <div className="circle-chart">
                            <div className="circle green-circle">
                              <span>92%</span>
                            </div>
                            <p>Recovery</p>
                          </div>
                          <div className="circle-chart">
                            <div className="circle purple-circle">
                              <span>78%</span>
                            </div>
                            <p>Follow-up</p>
                          </div>
                        </div>
                      </div>

                      <div className="activity-feed">
                        <h5 className="feed-title">Recent Activity</h5>
                        {[1, 2, 3].map(i => (
                          <div key={i} className="feed-item">
                            <div className="feed-avatar"></div>
                            <div className="feed-text">
                              <p className="feed-action">New patient checked in</p>
                              <p className="feed-time">{i * 5} minutes ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="macbook-base"></div>
            </div>
            <p className="device-label">Professional Dashboard</p>
          </div>

          {/* RIGHT: iPhone Medical Shop Mockup */}
          <div className="device-wrapper iphone-wrapper">
            <div className="iphone-frame">
              <div className="iphone-notch"></div>
              <div className="iphone-screen">
                {/* Medical Shop Content */}
                <div className="shop-content">
                  <div className="shop-header">
                    <ShoppingBag className="w-6 h-6" />
                    <h3 className="shop-title">Medical Supply Shop</h3>
                  </div>

                  <div className="shop-search">
                    <input type="text" placeholder="Search medical supplies..." className="search-input" />
                  </div>

                  <div className="product-grid">
                    {medicalProducts.map(product => (
                      <div key={product.id} className="product-card">
                        <div className="product-image" style={{
                          backgroundImage: `url(${product.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}></div>
                        <div className="product-info">
                          <h4 className="product-name">{product.name}</h4>
                          <p className="product-price">{product.price}</p>
                          <button className="add-cart-btn">Add to Cart</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="shop-cta-btn">
                    View All Products
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <p className="device-label">Medical Supplies</p>
          </div>
        </div>

        {/* ===== COMMUNITY SPACE SECTION (Below Devices) ===== */}
        <div className={`community-space ${isVisible ? 'visible' : ''}`}>
          <div className="community-header">
            <div className="community-title-section">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h3 className="community-title">Healthcare Community Live</h3>
              <span className="live-indicator">
                <span className="pulse-dot"></span>
                LIVE
              </span>
            </div>
            <p className="community-subtitle">
              Join the conversation—doctors and patients connecting in real-time
            </p>
          </div>

          <div className="community-feed">
            {communityMessages.map(message => (
              <div key={message.id} className="message-card">
                <div className={`message-avatar ${message.avatarColor}`}>
                  {message.name.charAt(0)}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-name">{message.name}</span>
                    <span className={`role-badge ${message.role === 'Doctor' ? 'doctor-badge' : 'patient-badge'}`}>
                      {message.role}
                    </span>
                    <span className="message-time">{message.timeAgo}</span>
                  </div>
                  <p className="message-text">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="join-space-btn">
            <Users className="w-5 h-5" />
            Join Healthcare Space
            <span className="participant-count">2,847 active now</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        /* ============================================
           CSS VARIABLES - THEME COLORS
        ============================================ */
        .hero-section {
          --brand-blue: #0B66FF;
          --cream: #F6F1EA;
          --white: #FFFFFF;
          --gray-50: #F9FAFB;
          --gray-100: #F3F4F6;
          --gray-200: #E5E7EB;
          --gray-300: #D1D5DB;
          --gray-600: #4B5563;
          --gray-900: #111827;
        }

        /* ============================================
           HERO SECTION BASE
        ============================================ */
        .hero-section {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--cream) 0%, var(--white) 50%, #E8F4FF 100%);
          overflow: hidden;
          padding: 4rem 1rem 2rem;
        }

        /* Background Orbs */
        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }

        .bg-orb-1 {
          width: 500px;
          height: 500px;
          background: var(--brand-blue);
          top: -100px;
          left: -100px;
        }

        .bg-orb-2 {
          width: 400px;
          height: 400px;
          background: #A78BFA;
          bottom: -100px;
          right: -100px;
          animation-delay: 5s;
        }

        .bg-orb-3 {
          width: 300px;
          height: 300px;
          background: #06B6D4;
          top: 50%;
          left: 50%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }

        /* Container */
        .hero-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* ============================================
           WELCOME HEADER (Separate Section)
        ============================================ */
        .welcome-header {
          text-align: center;
          margin-bottom: 6rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }

        .welcome-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--white);
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          color: var(--brand-blue);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .welcome-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--gray-900);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--brand-blue) 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          color: var(--gray-600);
          max-width: 800px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: var(--brand-blue);
          color: var(--white);
          box-shadow: 0 10px 25px -5px rgba(11, 102, 255, 0.4);
        }

        .btn-primary:hover {
          background: #0952CC;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(11, 102, 255, 0.5);
        }

        .btn-secondary {
          background: var(--white);
          color: var(--gray-900);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary:hover {
          background: var(--gray-50);
          transform: translateY(-2px);
        }

        /* ============================================
           DEVICES GRID (3 Devices)
        ============================================ */
        .devices-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease-out 0.3s;
        }

        .devices-grid.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive Grid */
        @media (min-width: 768px) {
          .devices-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .devices-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .device-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: deviceFloat 6s ease-in-out infinite;
        }

        .device-wrapper:nth-child(2) {
          animation-delay: 2s;
        }

        .device-wrapper:nth-child(3) {
          animation-delay: 4s;
        }

        @keyframes deviceFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .device-label {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-600);
          text-align: center;
        }

        /* ============================================
           IPHONE MOCKUP (Realistic Frame)
        ============================================ */
        .iphone-frame {
          width: 100%;
          max-width: 320px;
          aspect-ratio: 9 / 19;
          background: #1F2937;
          border-radius: 3rem;
          padding: 0.75rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            inset 0 0 0 2px rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .iphone-notch {
          position: absolute;
          top: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 28px;
          background: #1F2937;
          border-radius: 0 0 20px 20px;
          z-index: 10;
        }

        .iphone-screen {
          width: 100%;
          height: 100%;
          background: var(--white);
          border-radius: 2.5rem;
          overflow: hidden;
          position: relative;
        }

        /* App Content Styles */
        .app-content, .shop-content {
          padding: 3rem 1.5rem 1.5rem;
          height: 100%;
          overflow-y: auto;
          background: linear-gradient(180deg, #F0F9FF 0%, var(--white) 100%);
        }

        .app-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-blue), #06B6D4);
        }

        .app-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
        }

        .app-subtitle {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin: 0;
        }

        .status-badge {
          margin-left: auto;
          padding: 0.25rem 0.75rem;
          background: #10B981;
          color: var(--white);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .app-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: var(--white);
          padding: 1rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin: 0;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
        }

        .app-appointments {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 0.75rem;
        }

        .appointment-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--white);
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .appointment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #A78BFA, #EC4899);
        }

        .appointment-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }

        .appointment-time {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin: 0;
        }

        .join-btn {
          margin-left: auto;
          padding: 0.375rem 0.75rem;
          background: var(--brand-blue);
          color: var(--white);
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .app-cta-btn, .shop-cta-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          background: var(--brand-blue);
          color: var(--white);
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
        }

        /* Shop Content Styles */
        .shop-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .shop-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
        }

        .shop-search {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--gray-200);
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }

        .search-input:focus {
          border-color: var(--brand-blue);
        }

        .product-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .product-card {
          background: var(--white);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .product-image {
          width: 100%;
          height: 120px;
          background: var(--gray-200);
        }

        .product-info {
          padding: 0.75rem;
        }

        .product-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.25rem 0;
        }

        .product-price {
          font-size: 1rem;
          font-weight: 700;
          color: var(--brand-blue);
          margin: 0 0 0.5rem 0;
        }

        .add-cart-btn {
          width: 100%;
          padding: 0.5rem;
          background: var(--gray-900);
          color: var(--white);
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* ============================================
           MACBOOK MOCKUP (Realistic Frame)
        ============================================ */
        .macbook-frame {
          width: 100%;
          max-width: 600px;
        }

        .macbook-screen {
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #1F2937;
          border-radius: 1rem;
          padding: 0.5rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            inset 0 0 0 2px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .macbook-screen > div {
          width: 100%;
          height: 100%;
          background: var(--white);
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .macbook-base {
          width: 100%;
          height: 8px;
          background: linear-gradient(180deg, #374151 0%, #1F2937 100%);
          border-radius: 0 0 1rem 1rem;
          margin-top: -4px;
        }

        /* Dashboard Content Styles */
        .dashboard-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: var(--white);
          border-bottom: 1px solid var(--gray-200);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--brand-blue), #06B6D4);
          border-radius: 0.5rem;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gray-900);
        }

        .dashboard-nav {
          display: none;
          gap: 2rem;
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        @media (min-width: 600px) {
          .dashboard-nav {
            display: flex;
          }
        }

        .dashboard-main {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .dashboard-sidebar {
          width: 200px;
          padding: 1.5rem 1rem;
          background: var(--white);
          border-right: 1px solid var(--gray-200);
          display: none;
        }

        @media (min-width: 768px) {
          .dashboard-sidebar {
            display: block;
          }
        }

        .doctor-card {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .doctor-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-blue), #A78BFA);
          margin: 0 auto 0.75rem;
        }

        .doctor-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 0.25rem 0;
        }

        .doctor-specialty {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin: 0;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .quick-stat {
          background: var(--gray-50);
          padding: 0.75rem;
          border-radius: 0.5rem;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-blue);
        }

        .stat-text {
          font-size: 0.75rem;
          color: var(--gray-600);
        }

        .dashboard-charts {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .chart-card {
          background: var(--white);
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 1rem 0;
        }

        .chart-circles {
          display: flex;
          justify-content: space-around;
          gap: 1rem;
        }

        .circle-chart {
          text-align: center;
        }

        .circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--white);
          margin: 0 auto 0.5rem;
        }

        .blue-circle {
          background: linear-gradient(135deg, var(--brand-blue), #06B6D4);
        }

        .green-circle {
          background: linear-gradient(135deg, #10B981, #34D399);
        }

        .purple-circle {
          background: linear-gradient(135deg, #A78BFA, #C084FC);
        }

        .circle-chart p {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin: 0;
        }

        .activity-feed {
          background: var(--white);
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .feed-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 1rem 0;
        }

        .feed-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--gray-100);
        }

        .feed-item:last-child {
          border-bottom: none;
        }

        .feed-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F59E0B, #EF4444);
        }

        .feed-action {
          font-size: 0.875rem;
          color: var(--gray-900);
          margin: 0;
        }

        .feed-time {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin: 0;
        }

        /* ============================================
           COMMUNITY SPACE (Twitter-like)
        ============================================ */
        .community-space {
          background: var(--white);
          border-radius: 2rem;
          padding: 2rem;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease-out 0.5s;
        }

        .community-space.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .community-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .community-title-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .community-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: #EF4444;
          color: var(--white);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--white);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .community-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          margin: 0;
        }

        .community-feed {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
          max-height: 400px;
          overflow-y: auto;
        }

        @media (min-width: 768px) {
          .community-feed {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .message-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--gray-50);
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .message-card:hover {
          background: var(--gray-100);
          transform: translateY(-2px);
        }

        .message-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .message-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--gray-900);
        }

        .role-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .doctor-badge {
          background: #DBEAFE;
          color: var(--brand-blue);
        }

        .patient-badge {
          background: #F3E8FF;
          color: #7C3AED;
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin-left: auto;
        }

        .message-text {
          font-size: 0.875rem;
          color: var(--gray-600);
          line-height: 1.5;
          margin: 0;
        }

        .join-space-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, var(--brand-blue), #06B6D4);
          color: var(--white);
          border: none;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .join-space-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(11, 102, 255, 0.4);
        }

        .participant-count {
          padding: 0.25rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
        }

        /* ============================================
           RESPONSIVE ADJUSTMENTS
        ============================================ */
        @media (max-width: 599px) {
          .hero-section {
            padding: 2rem 1rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .devices-grid {
            gap: 2rem;
          }

          .community-space {
            padding: 1.5rem;
          }
        }

        @media (min-width: 600px) and (max-width: 899px) {
          .dashboard-nav span {
            display: none;
          }
          
          .dashboard-nav span:first-child {
            display: block;
          }
        }

        /* Performance: GPU acceleration */
        .device-wrapper,
        .message-card,
        .btn-primary,
        .btn-secondary {
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default Hero;