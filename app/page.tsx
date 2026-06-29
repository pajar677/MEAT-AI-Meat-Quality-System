'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MessageSquare, Upload, History, X, ChevronRight } from 'lucide-react';
import GaugeChart from '@/components/GaugeChart';
import QualityChart from '@/components/QualityChart';

export default function MeatQualitySystem() {
  const [mode, setMode] = useState<'analyze' | 'chat'>('analyze');
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeat = async () => {
    if (!image) return;
    setLoading(true);
    const prompt = `Analisis daging ini dan berikan output HANYA JSON: {"jenis_daging": "", "grade_kualitas": "", "skor_kualitas": 0, "warna": "", "tekstur": "", "tingkat_kesegaran": "", "kesimpulan": ""}`;
    
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: image.split(',')[1], prompt }),
    });
    
    const data = await res.json();
    try {
      const parsed = JSON.parse(data.text.replace(/^```json\s*/, '').replace(/\s*```$/, ''));
      setAnalysis(parsed);
      setHistory(prev => [{...parsed, image, time: new Date().toLocaleTimeString()}, ...prev].slice(0, 5));
    } catch (e) {
      alert("Failed to parse analysis result.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F0E8] font-sans flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside initial={{ width: 0 }} animate={{ width: 300 }} exit={{ width: 0 }} className="bg-[#1A1A1A] border-r border-[#2A2A2A] p-6 flex flex-col gap-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="uppercase tracking-widest text-[#8A8A8A] font-bold">Riwayat</h3>
              <button onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
            </div>
            {history.map((item, i) => (
              <div key={i} className="bg-[#0D0D0D] p-3 rounded-lg border border-[#2A2A2A] cursor-pointer hover:border-[#E8A020]" onClick={() => setAnalysis(item)}>
                <p className="font-bold">{item.jenis_daging}</p>
                <p className="text-[10px] text-[#8A8A8A]">{item.time} • {item.grade_kualitas}</p>
              </div>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 p-6 md:p-12">
        {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="fixed top-6 left-6 p-2 bg-[#1A1A1A] rounded-full"><ChevronRight/></button>}
        <header className="flex justify-between items-baseline border-b border-[#1A1A1A] pb-6 mb-10">
          <h1 className="text-7xl font-black tracking-tighter italic uppercase text-[#F5F0E8]">MEAT</h1>
          <span className="text-[#E8A020] font-mono text-xs tracking-widest uppercase">AI Quality Inspector</span>
        </header>

        <div className="flex gap-4 mb-10">
          <button onClick={() => setMode('analyze')} className={`px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs ${mode === 'analyze' ? 'bg-[#E8A020] text-[#0D0D0D]' : 'bg-[#1A1A1A]'}`}>Analisis Daging</button>
          <button onClick={() => setMode('chat')} className={`px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs ${mode === 'chat' ? 'bg-[#E8A020] text-[#0D0D0D]' : 'bg-[#1A1A1A]'}`}>Tanya AI</button>
        </div>

        {mode === 'analyze' && (
          <div className="grid md:grid-cols-12 gap-8">
            <section className="md:col-span-4 flex flex-col gap-6">
              <div className="border-2 border-dashed border-[#C0392B] bg-[#1A1A1A]/50 rounded-xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <input type="file" onChange={handleFileUpload} className="hidden" id="upload" />
                <label htmlFor="upload" className="cursor-pointer flex flex-col items-center gap-4">
                  <Upload size={48} className="text-[#C0392B]" />
                  <p className="text-[#8A8A8A] text-sm uppercase">Upload</p>
                </label>
                {image && <img src={image} alt="Preview" className="mt-4 rounded-lg max-h-48 object-cover" />}
                {loading && <div className="absolute inset-0 z-10 w-full h-8 bg-gradient-to-b from-[#C0392B]/50 to-transparent animate-scan"></div>}
                {image && !loading && (
                  <button onClick={analyzeMeat} className="mt-6 w-full py-3 bg-[#C0392B] rounded-lg font-bold hover:bg-[#A93226] transition-colors">
                    {analysis ? 'Analisis Ulang' : 'Analisis'}
                  </button>
                )}
              </div>
            </section>
            <section className="md:col-span-8">
              {analysis ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A]">
                  <h2 className="text-3xl font-black uppercase mb-6">{analysis.jenis_daging}</h2>
                  <div className="flex gap-4 mb-6">
                    <GaugeChart score={analysis.skor_kualitas} />
                    <div className="flex-1"><QualityChart score={analysis.skor_kualitas} /></div>
                  </div>
                  <p className="text-[#F5F0E8]">{analysis.kesimpulan}</p>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center text-[#8A8A8A] bg-[#1A1A1A] rounded-2xl border border-dashed border-[#2A2A2A]">
                  Hasil akan muncul di sini.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
