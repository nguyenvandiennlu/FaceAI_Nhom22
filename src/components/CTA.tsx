import { motion } from 'framer-motion'
import { ArrowRight, GitBranch } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-36 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="flex justify-center mb-10">
            <span className="badge-glow chip text-[var(--color-primary-light)] gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-light)] animate-pulse" aria-hidden="true" />
              Ready to try
            </span>
          </div>

          <h2
            className="font-black tracking-[-0.04em] text-balance mb-6"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', lineHeight: '1.06' }}
          >
            Find your perfect{' '}
            <span className="text-gradient">eyewear match</span>
            {' '}today.
          </h2>

          <p
            className="text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
          >
            Upload a photo, let our ensemble ML models analyse your face shape, and get personalised
            frame recommendations in under a second.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#upload" className="btn-primary group !py-3.5 !px-7 !text-[15px]">
              Analyse my face shape
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !py-3.5 !px-7 !text-[15px]"
            >
              <GitBranch className="w-4 h-4" aria-hidden="true" />
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>

      {/* Hairline top */}
      <div className="absolute top-0 left-0 right-0 hairline" />
      {/* Hairline bottom */}
      <div className="absolute bottom-0 left-0 right-0 hairline" />
    </section>
  )
}
