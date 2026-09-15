import { motion } from 'framer-motion'

// Fades + slides content in once it scrolls into view. `once: true` means
// it only plays the first time — scrolling back up won't re-trigger it,
// which feels calmer than re-animating every scroll direction change.
export default function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
