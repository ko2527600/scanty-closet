import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  User, 
  Mail, 
  Search,
  Archive,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  created_at: string;
}

export function MessageManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/contact/admin');
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: 'READ' | 'ARCHIVED' | 'NEW') => {
    try {
      await api.patch(`/contact/admin/${id}`, { status });
      setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      toast.success(`Message marked as ${status.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Transmission Logs</h1>
          <p className="text-slate-400">Manage all incoming customer inquiries and support requests.</p>
        </div>
        <Button onClick={fetchMessages} variant="outline" className="h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700">
          <RefreshCw size={18} className={cn("mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1 border border-slate-800 bg-slate-900/50 rounded-2xl overflow-hidden h-full min-h-[600px] flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search transmissions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-12 flex items-center justify-center">
                <RefreshCw className="animate-spin text-red-500" size={24} />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <MessageSquare className="mx-auto text-slate-700" size={48} />
                <p className="text-slate-500 font-medium">No transmissions found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={cn(
                      "w-full text-left p-4 transition-all hover:bg-slate-800/50",
                      selectedMessage?.id === msg.id && "bg-slate-800/80 border-l-4 border-red-500",
                      msg.status === 'NEW' && "bg-red-500/5"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                        msg.status === 'NEW' ? "bg-red-500 text-white" : "bg-slate-800 text-slate-400"
                      )}>
                        {msg.status}
                      </span>
                      <span className="text-[10px] text-slate-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{msg.subject}</h4>
                    <p className="text-xs text-slate-400 truncate">{msg.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 border border-slate-800 bg-slate-900/50 rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
          {selectedMessage ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 space-y-6 bg-slate-950/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-xl italic uppercase">
                        {selectedMessage.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                        <p className="text-slate-400 text-sm">{selectedMessage.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {selectedMessage.status === 'NEW' && (
                         <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selectedMessage.id, 'READ')}>
                           <CheckCircle size={16} className="mr-2" />
                           Mark Seen
                         </Button>
                       )}
                       <Button size="sm" variant="outline" className="border-slate-700" onClick={() => updateStatus(selectedMessage.id, 'ARCHIVED')}>
                         <Archive size={16} className="mr-2" />
                         Archive
                       </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/50">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center">
                        <Clock size={10} className="mr-1" /> Sent At
                      </p>
                      <p className="text-xs text-white font-bold">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center">
                        <User size={10} className="mr-1" /> Sender
                      </p>
                      <p className="text-xs text-white font-bold">{selectedMessage.name}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 bg-slate-950/10">
                   <div className="space-y-6 max-w-3xl">
                      <div className="space-y-2">
                         <p className="text-[10px] uppercase font-black tracking-widest text-red-500 italic">Transmission Subject</p>
                         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{selectedMessage.subject}</h2>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Message Content</p>
                         <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-8 text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {selectedMessage.message}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-800 flex justify-end gap-4 bg-slate-950/30">
                   <a href={`mailto:${selectedMessage.email}`} className="h-12 px-6 flex items-center justify-center bg-white text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300">
                     <Mail size={16} className="mr-2" />
                     Draft Response
                   </a>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-50">
               <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center">
                  <MessageSquare size={48} className="text-slate-700" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">No Message Selected</h3>
                  <p className="text-slate-500 text-sm max-w-xs">Select a transmission from the left to view the full content and metadata.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
