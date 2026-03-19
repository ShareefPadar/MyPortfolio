"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LayoutDashboard, CheckCircle2, User, Wallet, Clock, Users, Receipt } from "lucide-react";

const RoomyDemo = ({ animate = true, scale = 1 }: { animate?: boolean, scale?: number }) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("ledger");
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="w-full max-w-[360px] mx-auto bg-[#F8FAFC] rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)] border-[10px] border-white overflow-hidden font-sans text-slate-900">
      {/* HEADER SECTION - Based on Screenshot */}
      <div className="bg-[#0F172A] p-6 text-white pb-10 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{isAdmin ? "Admin Dashboard" : "My Dashboard"}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Welcome back, {isAdmin ? "Steven" : "Alex"}
              </p>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdmin(!isAdmin)}
            className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <Users className="w-5 h-5 text-slate-400" />
          </motion.button>
        </div>

        {/* SUMMARY CARDS GRID */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Expected</p>
            <p className="text-sm font-bold">AED 12100.00</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Collected</p>
            <motion.p 
              key={isPaid ? "paid" : "unpaid"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-emerald-400"
            >
              AED {isPaid ? "550.00" : "0.00"}
            </motion.p>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="px-6 -mt-6 relative z-20">
        <div className="bg-white p-1.5 rounded-2xl shadow-lg flex gap-1 border border-slate-100">
          <button 
            onClick={() => setActiveTab("ledger")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "ledger" ? "bg-[#0F172A] text-white" : "text-slate-400"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Rent Ledger
          </button>
          <button 
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "approvals" ? "bg-[#0F172A] text-white" : "text-slate-400"}`}
          >
            <CheckCircle2 className="w-4 h-4" /> Approvals
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">Rent Status</h4>
          <span className="text-[9px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wider">March 2026</span>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">A</div>
               <p className="font-bold text-slate-800">Alex</p>
             </div>
             <motion.div 
               animate={{ backgroundColor: isPaid ? "#ECFDF5" : "#FFFBEB", color: isPaid ? "#059669" : "#D97706" }}
               className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest"
             >
               {isPaid ? "PAID" : "UNPAID"}
             </motion.div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-50">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
               <span>Base Rent</span>
               <span className="text-slate-800 font-bold">AED 550.00</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-sm font-bold text-slate-800">Balance Due</span>
               <motion.span 
                 animate={{ color: isPaid ? "#10B981" : "#0F172A" }}
                 className="text-sm font-black"
               >
                 AED {isPaid ? "0.00" : "550.00"}
               </motion.span>
            </div>
          </div>
          
          {isAdmin && !isPaid && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsPaid(true)}
              className="w-full bg-[#0F172A] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-slate-200"
            >
              Confirm Payment
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomyDemo;
