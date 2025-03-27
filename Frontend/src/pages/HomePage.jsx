import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import useThemeStore from '../store/themeStore';
import { ArrowRight, ArrowUpRight, PieChart, BarChart3, LineChart, Check, CreditCard, Wallet, TrendingUp, Shield, RefreshCw } from 'lucide-react';


const COLORS = [
  "#13FFAA",
  "#1E67C6",
  "#CE84CF",
  "#DD335C"
];

function HomePage() {
  const isDark = useThemeStore(state => state.isDark());
  const color = useMotionValue(COLORS[0]);
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%,
      ${isDark?'#020617':'#fff'} 50%,${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;   

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <motion.section
        style={{
          backgroundImage,
        }}
        className={`relative grid min-h-screen 
          place-content-center overflow-hidden bg-gray-950 px-4
          py-24 ${isDark?'text-gray-50':'text-gray-800'}`}
      >
        <div className='relative z-10 flex flex-col items-center justify-center text-center'>
          <div className='mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 p-1.5 text-sm'>
            Beta Now Live ! 🎉
          </div>
          <h1 className='mb-4 text-5xl font-bold tracking-tight sm:text-6xl'>
            Welcome to FinTrack
          </h1>  
          <p className='mb-8 text-lg font-normal sm:text-xl'>
            Your all-in-one finance management app.
          </p>
          <motion.button 
            className={`group relative flex w-fit items-center
              gap-1.5 rounded-full bg-gray-950/10 px-6 py-3
              ${isDark?'text-gray-50':'text-gray-800'} transition-colors hover:bg-gray-950/50`}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            style={{
              border,
              boxShadow,
            }}
          >
            <Link to="/register" className='flex items-center gap-2'>
              Start Tracking Now 
              <motion.span
                initial={{ x: 0 }}
                className="inline-block"
                whileHover={{ x: 3, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.6 } }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Link>
          </motion.button>
          
          {/* Floating decorations */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section
        className={`py-24 ${
          isDark
            ? 'bg-[#020617]'
            : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDark ? 'text-gray-50' : 'text-gray-800'
              }`}
            >
              Powerful Financial Tools
            </h2>
            <p
              className={`${
                isDark ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto`}
            >
              Take control of your finances with our comprehensive suite of tools
              designed to help you track, manage, and grow your money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className={`backdrop-blur-sm rounded-xl p-6 shadow-lg border ${
                isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-white'
              }`}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div
                className={`rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4 ${
                  isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                }`}
              >
                <PieChart
                  className={`h-7 w-7 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-gray-50' : 'text-gray-800'
                }`}
              >
                Expense Tracking
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Automatically categorize and visualize your expenses to understand
                where your money goes.
              </p>
              <Link
                to="/register"
                className={`inline-flex items-center mt-4 font-medium ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}
              >
                Learn more
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className={`backdrop-blur-sm rounded-xl p-6 shadow-lg border ${
                isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-white'
              }`}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div
                className={`rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4 ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}
              >
                <BarChart3
                  className={`h-7 w-7 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-gray-50' : 'text-gray-800'
                }`}
              >
                Budget Planning
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Create customized budgets and track your progress to ensure you stay
                on financial target.
              </p>
              <Link
                to="/register"
                className={`inline-flex items-center mt-4 font-medium ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                Learn more
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className={`backdrop-blur-sm rounded-xl p-6 shadow-lg border ${
                isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-white'
              }`}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div
                className={`rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4 ${
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}
              >
                <LineChart
                  className={`h-7 w-7 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-gray-50' : 'text-gray-800'
                }`}
              >
                Financial Insights
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Gain valuable insights with interactive charts and personalized
                recommendations.
              </p>
              <Link
                to="/register"
                className={`inline-flex items-center mt-4 font-medium ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}
              >
                Learn more
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        className={`py-24 relative ${
          isDark
            ? 'bg-[#020617]'
            : 'bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
        }`}
      >
        {/* Overlay gradient for depth */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isDark 
            ? 'from-transparent via-emerald-900/5 to-transparent' 
            : 'from-transparent via-emerald-500/5 to-transparent'
        } pointer-events-none`}></div>
        
        <div className="container relative mx-auto px-4">
          <div className={`text-center mb-16 backdrop-blur-sm p-8 rounded-2xl border ${
            isDark 
              ? 'border-gray-700 bg-gray-900/30' 
              : 'border-gray-200 bg-white/80 shadow-lg'
          }`}>
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              How Fin<span className='text-emerald-500'>Track</span> Works
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Get started in minutes and take control of your financial life with these simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative group">
              <div className={`flex flex-col items-center text-center backdrop-blur-md p-6 rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'border-gray-700/30 bg-gray-900/30 hover:bg-white/10' 
                  : 'border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-emerald-100'
              }`}>
                <div className={`rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 relative z-10 ${
                  isDark
                    ? 'bg-blue-900/30 border border-blue-500/30 group-hover:border-blue-400'
                    : 'bg-blue-50 border border-blue-200 group-hover:border-blue-300'
                }`}>
                  <span className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Create an Account
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Sign up for free and set up your profile in just a few clicks.
                </p>
              </div>
              {/* Connector line */}
              <div className={`hidden md:block absolute top-12 left-full w-full h-0.5 ${
                isDark ? 'bg-blue-500/30' : 'bg-blue-300/50'
              } -z-10 transform -translate-x-1/2`}></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative group">
              <div className={`flex flex-col items-center text-center backdrop-blur-md p-6 rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'border-gray-700/30 bg-gray-900/30 hover:bg-white/10' 
                  : 'border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-emerald-100'
              }`}>
                <div className={`rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 relative z-10 ${
                  isDark
                    ? 'bg-emerald-900/30 border border-emerald-500/30 group-hover:border-emerald-400'
                    : 'bg-emerald-50 border border-emerald-200 group-hover:border-emerald-300'
                }`}>
                  <span className={`text-xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>2</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Add your Transactions
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Start by adding your Incomes, Expenses, and Budgets.
                </p>
              </div>
              {/* Connector line */}
              <div className={`hidden md:block absolute top-12 left-full w-full h-0.5 ${
                isDark ? 'bg-emerald-500/30' : 'bg-emerald-300/50'
              } -z-10 transform -translate-x-1/2`}></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative group">
              <div className={`flex flex-col items-center text-center backdrop-blur-md p-6 rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'border-gray-700/30 bg-gray-900/30 hover:bg-white/10' 
                  : 'border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-emerald-100'
              }`}>
                <div className={`rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 relative z-10 ${
                  isDark
                    ? 'bg-purple-900/30 border border-purple-500/30 group-hover:border-purple-400'
                    : 'bg-purple-50 border border-purple-200 group-hover:border-purple-300'
                }`}>
                  <span className={`text-xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>3</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Start Managing
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Set budgets, track expenses, and watch your financial health improve.
                </p>
              </div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full ${
            isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
          } blur-3xl`}></div>
          <div className={`absolute top-1/4 -right-10 w-40 h-40 rounded-full ${
            isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'
          } blur-3xl`}></div>
        </div>
      </section>

      
      {/* Benefits Section */}
      <section 
        className={`py-24 relative ${
          isDark
            ? 'bg-[#020617]'
            : 'bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
        }`}
      >
        {/* Overlay gradient for depth */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isDark 
            ? 'from-transparent via-blue-900/5 to-transparent' 
            : 'from-transparent via-blue-500/5 to-transparent'
        } pointer-events-none`}></div>

        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left side: Image/Illustration */}
            <div className="lg:w-1/2">
              <motion.div 
                className={`overflow-hidden border-2 rounded-xl ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={isDark ? "/Financial_Dashboard_dark.png" : "/Financial_Dashboard_light.png"} 
                    alt="Financial dashboard" 
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Right side: Benefits list */}
            <div className="lg:w-1/2">
              <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Why Choose Fin<span className="text-emerald-500">Track</span>?
              </h2>
              <div className="space-y-5">
                {/* Benefit 1 */}
                <motion.div 
                  className={`flex items-start p-3 rounded-lg transition-all ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-50'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                  }`}>
                    <Check className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      All Your Finances in One Place
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Aggregate all your accounts, cards, and investments for a complete financial picture.
                    </p>
                  </div>
                </motion.div>
                
                {/* Benefit 2 */}
                <motion.div 
                  className={`flex items-start p-3 rounded-lg transition-all ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                  }`}>
                    <Check className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Intelligent Categorization
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Our AI automatically categorizes your transactions to save you time and provide accurate insights.
                    </p>
                  </div>
                </motion.div>
                
                {/* Benefit 3 */}
                <motion.div 
                  className={`flex items-start p-3 rounded-lg transition-all ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-purple-50'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                  }`}>
                    <Check className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Customizable Budgets
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Create personalized budgets that match your financial goals and spending habits.
                    </p>
                  </div>
                </motion.div>
                
                {/* Benefit 4 */}
                <motion.div 
                  className={`flex items-start p-3 rounded-lg transition-all ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-50'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                  }`}>
                    <Check className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Secure & Private
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bank-level encryption ensures your financial data remains safe and confidential.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <motion.button 
                className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg border border-emerald-400/30"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/register" className="flex items-center gap-2">
                  Get Started Free
                  <motion.span
                    initial={{ x: 0 }}
                    className="inline-block"
                    whileHover={{ x: 3, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.6 } }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className={`absolute -bottom-10 left-10 w-64 h-64 rounded-full ${
          isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'
        } blur-3xl`}></div>
        <div className={`absolute top-1/3 right-0 w-64 h-64 rounded-full ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        } blur-3xl`}></div>
      </section>


    {/* Social Proof/Testimonials */}
    <section 
      className={`py-24 relative ${
        isDark
          ? 'bg-[#020617]'
          : 'bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
      }`}
    >
      {/* Overlay gradient for depth */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isDark 
          ? 'from-transparent via-purple-900/5 to-transparent' 
          : 'from-transparent via-purple-500/5 to-transparent'
      } pointer-events-none`}></div>

      <div className="container relative mx-auto px-4">
        <div className={`text-center mb-16 backdrop-blur-sm p-8 rounded-2xl border ${
          isDark 
            ? 'border-gray-700 bg-gray-900/30' 
            : 'border-gray-200 bg-white/80 shadow-lg'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            What Our <span className="text-emerald-500">Users</span> Say
          </h2>
          <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of satisfied users who have transformed their financial habits with FinTrack.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <motion.div 
            className={`backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 ${
              isDark 
                ? 'border-gray-700/50 bg-gray-900/30 hover:bg-white/5' 
                : 'border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-blue-100'
            }`}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold ${
                isDark 
                  ? 'bg-blue-900/50 text-blue-300' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                S
              </div>
              <div className="ml-4">
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Sarah Johnson</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Freelancer</p>
              </div>
            </div>
            <p className={`italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              "FinTrack has completely changed how I manage my freelance income. I can finally see my cash flow clearly and plan for taxes effectively."
            </p>
            <div className="flex text-yellow-400 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
          </motion.div>
          
          {/* Testimonial 2 */}
          <motion.div 
            className={`backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 ${
              isDark 
                ? 'border-gray-700/50 bg-gray-900/30 hover:bg-white/5' 
                : 'border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-emerald-100'
            }`}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold ${
                isDark 
                  ? 'bg-emerald-900/50 text-emerald-300' 
                  : 'bg-emerald-100 text-emerald-600'
              }`}>
                M
              </div>
              <div className="ml-4">
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Michael Torres</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Small Business Owner</p>
              </div>
            </div>
            <p className={`italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              "As a business owner, keeping personal and business finances separate was a challenge until I found FinTrack. Now I have complete clarity on both."
            </p>
            <div className="flex text-yellow-400 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
          </motion.div>
          
          {/* Testimonial 3 */}
          <motion.div 
            className={`backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 ${
              isDark 
                ? 'border-gray-700/50 bg-gray-900/30 hover:bg-white/5' 
                : 'border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-purple-100'
            }`}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold ${
                isDark 
                  ? 'bg-purple-900/50 text-purple-300' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                A
              </div>
              <div className="ml-4">
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Aisha Patel</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Graduate Student</p>
              </div>
            </div>
            <p className={`italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              "Managing student loans while on a tight budget seemed impossible until I started using FinTrack. Now I'm steadily paying off debt while saving for the future."
            </p>
            <div className="flex text-yellow-400 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full ${
          isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'
        } blur-3xl`}></div>
        <div className={`absolute top-1/4 -right-10 w-40 h-40 rounded-full ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        } blur-3xl`}></div>
      </div>
    </section>

    {/* FAQ Section */}
    <section 
      className={`py-24 relative ${
        isDark
          ? 'bg-[#020617]'
          : 'bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
      }`}
    >
      {/* Overlay gradient for depth */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isDark 
          ? 'from-transparent via-indigo-900/5 to-transparent' 
          : 'from-transparent via-indigo-500/5 to-transparent'
      } pointer-events-none`}></div>
      
      {/* Grid background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]' 
          : 'bg-[linear-gradient(to_right,#f0f0f01a_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f01a_1px,transparent_1px)] bg-[size:6rem_4rem]'
      }`}></div>
      
      {/* Radial gradient for depth */}
      <div className={`absolute left-0 right-0 top-[-10%] h-[1000px] w-full rounded-full ${
        isDark
          ? 'bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,transparent)]'
          : 'bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF5e,transparent)]'
      }`}></div>

      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-16 backdrop-blur-sm p-8 rounded-2xl border ${
          isDark 
            ? 'border-gray-700/40 bg-gray-900/40' 
            : 'border-gray-200 bg-white/80 shadow-lg'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Frequently Asked <span className="text-emerald-500">Questions</span>
          </h2>
          <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Find answers to common questions about FinTrack and financial management.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* FAQ Item 1 */}
          <motion.div 
            className={`backdrop-blur-md border rounded-lg p-6 shadow-lg ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white border-gray-200 hover:border-emerald-100'
            }`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Is my financial data secure with FinTrack?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Yes, we implement bank-level 256-bit encryption and follow industry best practices for data security. We never sell your data to third parties, and you can delete your account and data at any time.
            </p>
          </motion.div>
          
          {/* FAQ Item 2 */}
          <motion.div 
            className={`backdrop-blur-md border rounded-lg p-6 shadow-lg ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white border-gray-200 hover:border-blue-100'
            }`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              How much does FinTrack cost?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              FinTrack offers a free tier with essential features for basic financial management. Premium plans with additional features start at $4.99/month when billed annually.
              <span className="ml-1 text-emerald-400 font-medium">(Coming Soon✌️)</span>
            </p>
          </motion.div>
          
          {/* FAQ Item 3 */}
          <motion.div 
            className={`backdrop-blur-md border rounded-lg p-6 shadow-lg ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white border-gray-200 hover:border-purple-100'
            }`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Can I export my financial data?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Yes, all users can export their transaction history, reports, and budget information in CSV and PDF formats at any time.
              <span className="ml-1 text-emerald-400 font-medium">(Coming Soon✌️)</span>
            </p>
          </motion.div>
          
          {/* FAQ Item 4 */}
          <motion.div 
            className={`backdrop-blur-md border rounded-lg p-6 shadow-lg ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white border-gray-200 hover:border-emerald-100'
            }`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              How do I get started with FinTrack?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Simply create a free account, connect your financial accounts if desired (optional), and start tracking your expenses and income. Our setup wizard will guide you through the process.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        } blur-3xl pointer-events-none`}></div>
        <div className={`absolute top-1/3 -right-20 w-64 h-64 rounded-full ${
          isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'
        } blur-3xl pointer-events-none`}></div>
      </div>
    </section>

    {/* Final CTA Section */}
    <section 
      className={`py-24 relative ${
        isDark
          ? 'bg-[#020617]'
          : 'bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
      }`}
    >
      {/* Overlay gradient for depth */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isDark 
          ? 'from-transparent via-blue-900/10 to-transparent' 
          : 'from-transparent via-blue-500/10 to-transparent'
      } pointer-events-none`}></div>
      
      {/* Grid background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]' 
          : 'bg-[linear-gradient(to_right,#f0f0f01a_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f01a_1px,transparent_1px)] bg-[size:6rem_4rem]'
      }`}></div>
      
      {/* Radial gradient for depth */}
      <div className={`absolute left-0 right-0 top-[-10%] h-[1000px] w-full rounded-full ${
        isDark
          ? 'bg-[radial-gradient(circle_500px_at_50%_300px,#fbfbfb36,transparent)]'
          : 'bg-[radial-gradient(circle_600px_at_50%_200px,#C9EBFF5e,transparent)]'
      }`}></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className={`p-8 rounded-2xl border backdrop-blur-sm mb-8 max-w-3xl mx-auto ${
          isDark 
            ? 'border-gray-700/40 bg-gray-900/40' 
            : 'border-gray-200 bg-white/80 shadow-lg'
        }`}>
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Ready to <span className="text-emerald-500">Transform</span> Your Finances?
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of users who have taken control of their financial future with FinTrack.
          </p>
          
          <motion.button 
            className={`inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 shadow-lg text-lg font-medium ${
              isDark ? 'border border-white/10' : 'border border-emerald-400/30'
            }`}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/register" className="flex items-center gap-2">
              Start Your Free Account
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.5 } }}
                className="inline-block"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Link>
          </motion.button>
        </div>
        
        <div className={`mt-8 flex items-center justify-center text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <Shield className="h-4 w-4 mr-2 text-emerald-500" />
          <span>No credit card required. Free forever plan available.</span>
        </div>
        
        <div className={`mt-12 flex flex-wrap justify-center gap-8 backdrop-blur-sm p-6 rounded-xl border max-w-4xl mx-auto ${
          isDark 
            ? 'border-gray-700/40 bg-gray-900/30' 
            : 'border-gray-200 bg-white/80 shadow-md'
        }`}>
          <div className="flex items-center">
            <RefreshCw className={`h-6 w-6 mr-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={isDark ? 'text-gray-200' : 'text-gray-600'}>14-day money back guarantee</span>
          </div>
          <div className="flex items-center">
            <CreditCard className={`h-6 w-6 mr-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={isDark ? 'text-gray-200' : 'text-gray-600'}>Cancel anytime</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className={`h-6 w-6 mr-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={isDark ? 'text-gray-200' : 'text-gray-600'}>Free updates</span>
          </div>
          <div className="flex items-center">
            <Wallet className={`h-6 w-6 mr-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={isDark ? 'text-gray-200' : 'text-gray-600'}>All payment methods accepted</span>
          </div>
        </div>
      </div>
      
      {/* Decorative blurred elements */}
      <div className={`absolute bottom-1/4 -left-10 w-64 h-64 rounded-full ${
        isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
      } blur-3xl pointer-events-none`}></div>
      <div className={`absolute top-1/4 -right-10 w-64 h-64 rounded-full ${
        isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
      } blur-3xl pointer-events-none`}></div>
    </section>
    </div>
  );
}

export default HomePage;