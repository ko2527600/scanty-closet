import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../lib/axios';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success('Transmission successful!', {
        description: "We've received your message and will get back to you shortly.",
        style: { background: '#111', color: '#fff', border: '1px solid #dc2626' }
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Map labels to form keys if needed, but easier to just use the correct names
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-brand-red font-black uppercase tracking-widest text-xs italic">
            <MessageSquare size={16} />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            Contact <br /> <span className="text-brand-silver/20 decoration-brand-red underline underline-offset-8 decoration-4 font-black italic">Us.</span>
          </h1>
        </div>
        <p className="text-brand-silver/50 max-w-sm font-medium text-lg leading-relaxed">
          Questions about a drop? Need help with your order? Our team is live and ready to assist your street game.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Contact Info omitted for brevity in target content, but keeping it all */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Direct Channels</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <a href="tel:0245060754" className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 hover:border-brand-red transition-all duration-500">
                <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-silver/30">Phone Number</p>
                  <p className="text-xl font-black text-white italic">024 506 0754</p>
                </div>
              </a>

              <a href="mailto:Ohenekobi98@gmail.com" className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 hover:border-brand-red transition-all duration-500">
                <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-silver/30">Email Support</p>
                  <p className="text-xl font-black text-white italic">Ohenekobi98@gmail.com</p>
                </div>
              </a>

              <a 
                href="https://maps.app.goo.gl/RqvgMrNoYvsbKmCL7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 hover:border-brand-red transition-all duration-500"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
                  <MapPin size={20} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-silver/30">HQ Location</p>
                  <p className="text-xl font-black text-white italic underline underline-offset-4 decoration-brand-red/30 group-hover:decoration-brand-red transition-all">Accra, Ghana</p>
                </div>
              </a>

              <div className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center rotate-3">
                  <Clock size={20} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-silver/30">Business Hours</p>
                  <p className="text-xl font-black text-white italic">Mon - Sun: 9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan card */}
          <div className="relative overflow-hidden p-12 bg-brand-red rounded-[3rem] group">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none relative z-10">
              "Punctuality is the soul of business."
            </h3>
            <p className="text-white/70 mt-4 font-bold uppercase tracking-widest text-xs relative z-10">The Scanty's Closet Creed</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 space-y-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-red/5 blur-[10rem] -z-10" />
          
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Send a Transmission</h2>
            <p className="text-brand-silver/50 font-medium">Have a specific inquiry? Drop us a line below and we'll get back to you within 24 hours.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Full Name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
              <Input label="Email Address" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
            </div>
            <Input label="Subject" name="subject" placeholder="Order Inquiry #1234" value={form.subject} onChange={handleChange} />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-brand-silver/30">Your Message</label>
              <textarea 
                name="message"
                className="w-full min-h-[150px] bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red/30 transition-all placeholder:text-brand-silver/20"
                placeholder="How can we help your street game?"
                value={form.message}
                onChange={handleChange}
              />
            </div>
            <Button size="lg" className="w-full h-16 rounded-2xl group/btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <Send size={18} className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
