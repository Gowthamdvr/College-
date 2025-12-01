import React from 'react';
import { Navbar } from '../components/Layout';
import { Link } from 'react-router-dom';
import { 
  Calendar, Users, ShieldCheck, Star, 
  ArrowRight, Heart, Activity, 
  Stethoscope, Baby, Brain, Bone, Eye 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center bg-teal-500 bg-opacity-30 rounded-full px-4 py-1.5 text-sm font-medium border border-teal-400">
                <Star className="w-4 h-4 text-yellow-300 mr-2" fill="currentColor" />
                #1 Trusted Healthcare in Pollachi
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Welcome to <br/>
                <span className="text-teal-200">Gowtham Hospital</span>
              </h1>
              <p className="text-teal-50 text-lg md:text-xl max-w-lg leading-relaxed">
                A multi-specialty healthcare center in Pollachi, offering appointment booking, doctor consultation, patient care, and emergency support.
              </p>
              
              <div className="pt-4 flex items-center space-x-8 text-sm font-medium text-teal-100">
                <div className="flex items-center"><Users className="w-5 h-5 mr-2" /> 10k+ Patients</div>
                <div className="flex items-center"><Stethoscope className="w-5 h-5 mr-2" /> Expert Doctors</div>
                <div className="flex items-center"><ShieldCheck className="w-5 h-5 mr-2" /> Verified Care</div>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Doctor smiling" 
                className="relative rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 z-10 border-4 border-white/20"
              />
              {/* Floating Card */}
              <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg z-20 flex items-center space-x-4 animate-bounce-slow">
                 <div className="bg-green-100 p-2 rounded-full">
                    <Activity className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-gray-900">Appointment Confirmed</p>
                    <p className="text-xs text-gray-500">Today at 2:00 PM</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Specialties</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              We provide comprehensive care across various medical fields.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <SpecialtyCard icon={<Heart className="w-6 h-6" />} title="Cardiology" />
            <SpecialtyCard icon={<Brain className="w-6 h-6" />} title="Neurology" />
            <SpecialtyCard icon={<Bone className="w-6 h-6" />} title="Orthopedics" />
            <SpecialtyCard icon={<Baby className="w-6 h-6" />} title="Pediatrics" />
            <SpecialtyCard icon={<Stethoscope className="w-6 h-6" />} title="General" />
            <SpecialtyCard icon={<Eye className="w-6 h-6" />} title="Ophthalmology" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-500">Book your appointment in 3 easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              number="01"
              title="Search Doctor"
              description="Find the best doctor for your needs by specialty or name."
            />
            <StepCard 
              number="02"
              title="Choose Slot"
              description="Select a convenient time slot from the doctor's available schedule."
            />
            <StepCard 
              number="03"
              title="Book Instantly"
              description="Confirm your appointment and receive instant confirmation."
            />
          </div>
        </div>
      </section>

      {/* Stats / CTA Banner */}
      <section className="bg-teal-900 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Are you a Doctor?</h2>
            <p className="text-teal-200 mb-8 max-w-2xl mx-auto text-lg">
              Join Gowtham Hospital's digital network to manage your appointments, build your online presence, and connect with patients.
            </p>
            <Link to="/register" className="bg-white text-teal-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center">
              Join as a Doctor <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <TestimonialCard 
               text="I found the perfect dermatologist within minutes. The booking process was seamless!"
               author="Emily R."
               role="Patient"
             />
             <TestimonialCard 
               text="Gowtham Hospital helped me organize my clinic schedule effortlessly. Highly recommended."
               author="Dr. Alan Grant"
               role="Cardiologist"
             />
             <TestimonialCard 
               text="Super easy to use. I love the reminders and the ability to see doctor availability in real-time."
               author="Michael T."
               role="Patient"
             />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center text-white text-xl font-bold mb-4">
              <Activity className="w-6 h-6 text-teal-500 mr-2" />
              Gowtham Hospital
            </div>
            <p className="text-sm">
              Gowtham Hospital is a multi-specialty healthcare center in Pollachi, Tamil Nadu, offering appointment booking, doctor consultation, patient care, and emergency support.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">For Patients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white">Search for Doctors</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/register" className="hover:text-white">Register</Link></li>
              <li><Link to="/" className="hover:text-white">Booking Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">For Doctors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white">Doctor Login</Link></li>
              <li><Link to="/register" className="hover:text-white">Join Network</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>gowthamhospital@gmail.com</li>
              <li>+91 97653 45868</li>
              <li>Pollachi, Tamil Nadu, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; 2024 Gowtham Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SpecialtyCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 text-center group">
      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative p-6">
      <div className="text-6xl font-bold text-gray-100 absolute -top-4 -left-2 z-0">{number}</div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ text, author, role }: { text: string, author: string, role: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
      <div className="text-teal-400 mb-4">
        <Star className="w-5 h-5 inline" fill="currentColor" />
        <Star className="w-5 h-5 inline" fill="currentColor" />
        <Star className="w-5 h-5 inline" fill="currentColor" />
        <Star className="w-5 h-5 inline" fill="currentColor" />
        <Star className="w-5 h-5 inline" fill="currentColor" />
      </div>
      <p className="text-gray-600 mb-6 italic">"{text}"</p>
      <div>
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}