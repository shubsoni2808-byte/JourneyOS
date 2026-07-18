import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { CheckCircle2, AlertCircle, Info, Sparkles, Award, Trophy } from 'lucide-react';

export const NotificationManager: React.FC = () => {
  const notifications = useGameStore((state) => state.notifications);
  const dismissNotification = useGameStore((state) => state.dismissNotification);

  const getIcon = (type: string) => {
    switch (type) {
      case 'level_up':
        return <Sparkles className="text-yellow-400 shrink-0" size={16} />;
      case 'quest_complete':
        return <Trophy className="text-indigo-400 shrink-0" size={16} />;
      case 'achievement':
        return <Award className="text-pink-400 shrink-0" size={16} />;
      case 'success':
        return <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-400 shrink-0" size={16} />;
      case 'warning':
        return <AlertCircle className="text-amber-400 shrink-0" size={16} />;
      default:
        return <Info className="text-sky-400 shrink-0" size={16} />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'level_up':
        return 'border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
      case 'quest_complete':
        return 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]';
      case 'achievement':
        return 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]';
      case 'success':
        return 'border-emerald-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-amber-500';
      default:
        return 'border-sky-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-3 bg-zinc-950/95 border-2 ${getBorderColor(
              n.type
            )} rounded text-slate-100 shadow-[4px_4px_0px_#000] relative overflow-hidden backdrop-blur-sm cursor-pointer hover:bg-zinc-900/95`}
            onClick={() => dismissNotification(n.id)}
          >
            {/* Custom Pixel lines inside alerts for styling */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10"></div>
            
            {getIcon(n.type)}
            
            <div className="flex-1 min-w-0">
              <span className="font-retro text-[8px] text-zinc-500 uppercase block tracking-wider mb-0.5">
                {n.type.replace('_', ' ')}
              </span>
              <p className="font-pixel text-lg leading-tight text-slate-200">
                {n.message}
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissNotification(n.id);
              }}
              className="text-zinc-600 hover:text-white font-retro text-[8px] self-start ml-2"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
