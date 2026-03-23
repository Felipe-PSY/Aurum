import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const colors = {
  success: 'border-emerald-500/20 bg-emerald-500/10',
  error: 'border-red-500/20 bg-red-500/10',
  warning: 'border-amber-500/20 bg-amber-500/10',
  info: 'border-blue-500/20 bg-blue-500/10',
};

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-4 px-6 py-4 border backdrop-blur-md shadow-2xl min-w-[300px] ${colors[type]}`}
    >
      <div className="shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-[11px] text-white uppercase tracking-widest font-medium">
        {message}
      </p>
      <button 
        onClick={onClose}
        className="shrink-0 text-white/20 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-[2px] ${
          type === 'success' ? 'bg-emerald-500' : 
          type === 'error' ? 'bg-red-500' : 
          type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        }`}
      />
    </motion.div>
  );
}
