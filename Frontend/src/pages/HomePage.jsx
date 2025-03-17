import React, { useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, LineChart, CreditCard, Wallet, 
         TrendingUp, Lock, Bell, BarChart3 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Sample chart component - you can replace with a real charting library
const SampleChart = ({ type }) => {
  return (
    <div className={`sample-chart ${type}-chart`}>
      {type === 'line' && <LineChart size={36} className="chart-icon" />}
      {type === 'pie' && <PieChart size={36} className="chart-icon" />}
      {type === 'bar' && <BarChart3 size={36} className="chart-icon" />}
    </div>
  );
};

function HomePage() {
  // Initialize animation on scroll
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  return (
    <div className="homepage-background">
      {/* Gradient blobs */}
      <div className="gradient-blob"></div>
      <div className="gradient-blob"></div>
      <div className="gradient-blob"></div>
      <div className="gradient-blob"></div>
      
      {/* Grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Noise texture */}
      <div className="noise-texture"></div>
      
      {/* Glass effect */}
      <div className="glass-overlay"></div>
      
      {/* Hero content */}
      <div className="hero-container">
        <h1 className="hero-title">
          <span className="text-block">Financial <span className="text-emerald-500">Freedom</span></span>
          <span className="text-block"><span className="text-emerald-500">Starts</span> Here</span>
        </h1>
        <p className="hero-subtitle">
          Track your expenses, manage your budget, and achieve your financial goals with FinTrack - your personal finance companion.
        </p>
        <Link to="/register" className="hero-cta">
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </div>
      
      {/* Feature highlights section */}
      <section className="feature-section">
        <div className="section-title" data-aos="fade-up">
          <h2>Powerful features to manage your finances</h2>
          <div className="section-underline"></div>
        </div>
        
        <div className="feature-cards">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div className="feature-icon">
              <Wallet size={32} />
            </div>
            <h3>Budget Tracking</h3>
            <p>Set monthly budgets and track your spending habits with our intuitive dashboard.</p>
          </div>
          
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-icon">
              <CreditCard size={32} />
            </div>
            <h3>Expense Management</h3>
            <p>Categorize and monitor your expenses to understand where your money goes.</p>
          </div>
          
          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Financial Goals</h3>
            <p>Create savings goals and track your progress with visual indicators.</p>
          </div>
          
          <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
            <div className="feature-icon">
              <Bell size={32} />
            </div>
            <h3>Bill Reminders</h3>
            <p>Never miss a payment with customizable alerts for upcoming bills.</p>
          </div>
        </div>
      </section>
      
      {/* Dashboard preview section */}
      <section className="dashboard-preview">
        <div className="section-title" data-aos="fade-up">
          <h2>Visualize your financial data</h2>
          <div className="section-underline"></div>
        </div>
        
        <div className="charts-container">
          <div className="chart-card" data-aos="fade-right">
            <h3>Spending Analysis</h3>
            <SampleChart type="pie" />
            <p>Break down your expenses by category to identify spending patterns.</p>
          </div>
          
          <div className="chart-card" data-aos="fade-up">
            <h3>Income vs Expenses</h3>
            <SampleChart type="bar" />
            <p>Compare your monthly income and expenses to optimize savings.</p>
          </div>
          
          <div className="chart-card" data-aos="fade-left">
            <h3>Savings Growth</h3>
            <SampleChart type="line" />
            <p>Track your savings growth and project future financial outcomes.</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials section */}
      <section className="testimonials">
        <div className="section-title" data-aos="fade-up">
          <h2>What our users say</h2>
          <div className="section-underline"></div>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
            <div className="quote">"FinTrack helped me save for my dream vacation in just 6 months!"</div>
            <div className="testimonial-author">Sarah J.</div>
          </div>
          
          <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
            <div className="quote">"I finally understand where my money goes each month. Game changer."</div>
            <div className="testimonial-author">Michael T.</div>
          </div>
          
          <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
            <div className="quote">"The budgeting tools are intuitive and have helped me eliminate debt."</div>
            <div className="testimonial-author">Priya S.</div>
          </div>
        </div>
      </section>
      
      {/* Final CTA section */}
      <section className="final-cta" data-aos="fade-up">
        <h2>Ready to take control of your finances?</h2>
        <p>Join thousands of users who've transformed their financial future with FinTrack.</p>
        <Link to="/register" className="cta-button">
          Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <div className="security-note">
          <Lock size={16} />
          <span>Your data is secure. 256-bit encryption. No credit card required.</span>
        </div>
      </section>
    </div>
  );
}

export default HomePage;