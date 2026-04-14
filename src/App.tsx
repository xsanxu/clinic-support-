/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Stethoscope, 
  Baby, 
  Microscope, 
  Activity,
  Star,
  Award,
  MessageCircle,
  Heart,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

// --- Components ---

const BackgroundBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
          rotate: [0, -45, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-action-rose/5 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -50, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-soft-blue/10 rounded-full blur-[80px]"
      />
    </div>
  );
};

const TiltCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="text-2xl font-extrabold text-primary-blue tracking-tight">
            MANASI <span className="text-accent-blue">CLINIC</span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {['About', 'Services', 'FAQ'].map((item, idx) => (
            <motion.a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-sm font-bold text-text-dark/80 hover:text-accent-blue transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-blue transition-all group-hover:w-full" />
            </motion.a>
          ))}
          <motion.a 
            href="#appointment" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-action-rose text-white px-7 py-3 rounded-full font-bold text-sm shadow-xl shadow-action-rose/20 hover:bg-action-rose-dark transition-all hover:-translate-y-1 active:scale-95"
          >
            Book Appointment
          </motion.a>
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-text-dark p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-100 py-10 px-6 flex flex-col gap-8 shadow-2xl"
          >
            {['About', 'Services', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-text-dark border-b border-gray-50 pb-4"
              >
                {item}
              </a>
            ))}
            <a 
              href="#appointment" 
              onClick={() => setIsOpen(false)}
              className="bg-action-rose text-white px-6 py-5 rounded-2xl font-bold text-center shadow-xl shadow-action-rose/20 text-lg"
            >
              Book Appointment
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const Counter = ({ target, label, suffix = "+" }: { target: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const duration = 2500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm"
    >
      <div className="text-5xl lg:text-6xl font-black text-primary-blue mb-3 tracking-tighter">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs lg:text-sm font-black text-text-gray uppercase tracking-[0.2em]">
        {label}
      </div>
    </motion.div>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className="border border-gray-100 rounded-[2rem] mb-4 overflow-hidden bg-white/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all"
    >
      <button 
        className="w-full p-7 flex justify-between items-center text-left font-bold text-text-dark hover:bg-soft-blue/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="bg-soft-blue p-2 rounded-full text-accent-blue"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-7 pb-7 text-text-gray text-sm leading-relaxed"
          >
            <div className="pt-2 border-t border-gray-50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    concern: '',
    date: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    phone: false
  });

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isNameValid = formData.name.length >= 2;
    const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone);

    setErrors({
      name: !isNameValid,
      phone: !isPhoneValid
    });

    if (isNameValid && isPhoneValid) {
      setShowModal(true);
      setFormData({ name: '', phone: '', concern: '', date: '' });
    }
  };

  return (
    <div className="min-h-screen font-sans text-text-dark selection:bg-accent-blue/20 bg-[#fcfdfe]">
      <BackgroundBlobs />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 lg:pt-56 pb-24 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-accent-blue/10 text-accent-blue px-5 py-2.5 rounded-full text-xs font-black mb-8 shadow-sm"
              >
                <Sparkles size={16} className="text-yellow-400" fill="currentColor" />
                TRUSTED WOMEN'S CARE SINCE 2000
              </motion.div>
              <h1 className="text-5xl lg:text-7xl font-black text-primary-blue leading-[1.05] mb-8 tracking-tight">
                Compassionate Care for <span className="text-accent-blue relative">
                  Every Stage.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-text-gray mb-12 max-w-xl leading-relaxed font-medium">
                Experience world-class maternity, infertility, and gynecological care with Dr. Suman Singh, Senior Consultant with over 25 years of expertise.
              </p>
              <div className="flex flex-wrap gap-5">
                <motion.a 
                  href="#appointment" 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-action-rose text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl shadow-action-rose/40 hover:bg-action-rose-dark transition-all"
                >
                  Book Appointment
                </motion.a>
                <motion.a 
                  href="https://wa.me/919481306930" 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#25d366] border-2 border-[#25d366]/20 px-10 py-5 rounded-full font-black text-lg flex items-center gap-3 shadow-xl shadow-black/5 hover:bg-[#25d366] hover:text-white transition-all"
                >
                  <MessageCircle size={22} fill="currentColor" />
                  WhatsApp
                </motion.a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-1000"
            >
              <TiltCard>
                <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" 
                    alt="Medical Care" 
                    className="w-full h-[450px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </TiltCard>

              {/* 3D Floating Badges */}
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotateZ: [-1, 1, -1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white z-20"
              >
                <div className="bg-soft-blue p-3 rounded-2xl text-accent-blue shadow-inner">
                  <Award size={28} />
                </div>
                <div>
                  <div className="font-black text-primary-blue text-lg">25+ Years</div>
                  <div className="text-[10px] text-text-gray font-black uppercase tracking-widest">Clinical Expert</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ 
                  y: [0, 20, 0],
                  rotateZ: [1, -1, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -right-10 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white z-20"
              >
                <div className="bg-pink-50 p-3 rounded-2xl text-action-rose shadow-inner">
                  <Heart size={28} fill="currentColor" />
                </div>
                <div>
                  <div className="font-black text-primary-blue text-lg">1.5 Lakh+</div>
                  <div className="text-[10px] text-text-gray font-black uppercase tracking-widest">Happy Patients</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Counter target={150000} label="Patients Treated" />
            <Counter target={25} label="Years in Practice" />
            <Counter target={12000} label="Successful IVF/IUIs" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 lg:py-48 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent-blue font-black text-sm uppercase tracking-[0.3em] mb-6"
            >
              OUR SPECIALTIES
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black text-primary-blue mb-8 tracking-tight"
            >
              Comprehensive Women's Health
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-gray font-medium"
            >
              We provide expert medical care tailored to every stage of a woman's life, from adolescence to menopause.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Baby size={40} />, title: 'Pregnancy Care', desc: 'Complete prenatal and postnatal care for a safe journey to motherhood.', color: 'bg-blue-50 text-blue-500' },
              { icon: <Microscope size={40} />, title: 'Infertility / IVF', desc: 'Advanced fertility treatments with high success rates and personalized care.', color: 'bg-purple-50 text-purple-500' },
              { icon: <Stethoscope size={40} />, title: 'Laparoscopy', desc: 'Minimally invasive surgeries for faster recovery and better clinical outcomes.', color: 'bg-emerald-50 text-emerald-500' }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-xl p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white hover:border-accent-blue/30 transition-all group"
              >
                <div className={`${service.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-primary-blue mb-5 tracking-tight">{service.title}</h3>
                <p className="text-text-gray font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="appointment" className="py-32 lg:py-48 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-white rounded-[4rem] overflow-hidden shadow-[0_100px_150px_-50px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row border border-white"
          >
            <div className="lg:w-[40%] bg-primary-blue p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/20 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-8 tracking-tight">Get in Touch</h3>
                <p className="text-white/70 mb-12 text-lg font-medium">Our team will confirm your slot within 30 minutes during working hours.</p>
                
                <div className="space-y-10">
                  {[
                    { icon: <MapPin size={24} />, title: 'Clinic Location', detail: 'No.971, 16th Main Road, BTM 2nd Stage, Bangalore' },
                    { icon: <Phone size={24} />, title: 'Call Us', detail: '+91 94813 06930' },
                    { icon: <Clock size={24} />, title: 'Working Hours', detail: 'Mon–Sat: 8 AM–11 AM & 4 PM–9 PM' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="bg-white/10 p-4 rounded-2xl h-fit group-hover:bg-white/20 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-black text-lg mb-1">{item.title}</div>
                        <div className="text-white/60 font-medium leading-relaxed">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-[60%] p-16 lg:p-20">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-text-dark uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-6 py-5 rounded-2xl border-2 outline-none transition-all font-bold text-lg ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-50 bg-gray-50/50 focus:border-accent-blue focus:bg-white'}`}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-black uppercase ml-1">Please enter your name</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-text-dark uppercase tracking-[0.2em] ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full px-6 py-5 rounded-2xl border-2 outline-none transition-all font-bold text-lg ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-50 bg-gray-50/50 focus:border-accent-blue focus:bg-white'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase ml-1">Enter a valid 10-digit number</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-text-dark uppercase tracking-[0.2em] ml-1">Primary Concern</label>
                  <div className="relative">
                    <select 
                      value={formData.concern}
                      onChange={(e) => setFormData({...formData, concern: e.target.value})}
                      className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-accent-blue focus:bg-white outline-none appearance-none font-bold text-lg"
                    >
                      <option value="">Select Option</option>
                      <option>Pregnancy Care</option>
                      <option>Infertility / IVF</option>
                      <option>PCOS / Period Issues</option>
                      <option>Other</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-gray">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-text-dark uppercase tracking-[0.2em] ml-1">Preferred Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-accent-blue focus:bg-white outline-none font-bold text-lg"
                  />
                </div>

                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-action-rose text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-action-rose/30 hover:bg-action-rose-dark transition-all"
                >
                  Confirm Booking →
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 lg:py-48 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-primary-blue tracking-tight">Common Questions</h2>
          </div>
          <div className="space-y-4">
            <FaqItem 
              question="What are the clinic timings?" 
              answer="The clinic is open Mon-Sat: 8:00 AM – 11:00 AM and 4:00 PM – 9:00 PM. We are closed on Sundays." 
            />
            <FaqItem 
              question="Do you offer IVF treatments?" 
              answer="Yes, Dr. Suman Singh is an infertility specialist with extensive experience in IVF, IUI, and ovulation induction." 
            />
            <FaqItem 
              question="How can I reach the clinic?" 
              answer="We are located in BTM 2nd Stage, Bangalore. You can find the exact location on our map or call us for directions." 
            />
            <FaqItem 
              question="Is there a pharmacy nearby?" 
              answer="Yes, there are several pharmacies within walking distance of the clinic for your convenience." 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-blue text-white/50 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
        
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-2">
              <div className="text-3xl font-black text-white mb-8 tracking-tighter">MANASI CLINIC</div>
              <p className="max-w-md leading-relaxed text-lg font-medium">
                Providing excellence in gynecological and obstetric care for over two decades in the heart of Bangalore. Our mission is to provide compassionate, evidence-based care to women of all ages.
              </p>
              <div className="flex gap-4 mt-10">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-5 h-5 bg-white/40 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-xl mb-8">Quick Links</h4>
              <ul className="space-y-5">
                {['About Dr. Suman', 'Our Services', 'FAQ', 'Book Appointment'].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().split(' ')[0]}`} className="hover:text-white transition-colors font-bold text-lg flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xl mb-8">Contact Info</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="text-accent-blue"><Phone size={24} /></div>
                  <div className="font-bold text-lg text-white">+91 94813 06930</div>
                </li>
                <li className="flex gap-4">
                  <div className="text-accent-blue"><MapPin size={24} /></div>
                  <div className="font-bold text-lg leading-relaxed">BTM 2nd Stage, Bangalore</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-xs font-black uppercase tracking-[0.4em]">
            © 2025 Manasi Clinic. Crafted for Excellence.
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-primary-blue/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: 20 }}
              className="relative bg-white p-12 lg:p-20 rounded-[4rem] shadow-2xl max-w-lg w-full text-center border border-white"
            >
              <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                <CheckCircle2 size={56} />
              </div>
              <h3 className="text-4xl font-black text-primary-blue mb-6 tracking-tight">Booking Received!</h3>
              <p className="text-text-gray mb-12 text-lg font-medium leading-relaxed">
                Our coordinator will call you shortly to confirm your slot. Thank you for choosing Manasi Clinic.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="w-full bg-primary-blue text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-primary-blue/30 hover:brightness-110 transition-all"
              >
                Great, Thanks
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Action */}
      <div className="lg:hidden fixed bottom-8 left-8 right-8 z-40">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white/80 backdrop-blur-2xl p-4 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-white flex justify-between items-center"
        >
          <a href="tel:+919481306930" className="flex items-center gap-3 px-6 font-black text-primary-blue text-lg">
            <Phone size={22} /> Call
          </a>
          <a 
            href="#appointment" 
            className="bg-action-rose text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-action-rose/30"
          >
            Book Now
          </a>
        </motion.div>
      </div>
    </div>
  );
}
