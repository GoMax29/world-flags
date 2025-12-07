import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export function FilterNotification() {
  const { filterNotification } = useAppStore();

  return (
    <AnimatePresence>
      {filterNotification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 300,
            duration: 0.3 
          }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          <div className="bg-gradient-to-br from-primary-500 to-cyan-500 
                          text-white px-8 py-4 rounded-2xl shadow-2xl
                          text-2xl sm:text-3xl font-bold tracking-wide
                          backdrop-blur-sm border border-white/20">
            {filterNotification}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





