import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skillGroups = [
  {
    category: 'Frontend',
    items: ['Vue.js', 'Nuxt.js', 'React', 'Angular', 'Tailwind CSS', 'TypeScript'],
  },
  {
    category: 'Mobile',
    items: ['Ionic', 'Capacitor', 'React Native', 'Expo'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'C++', 'REST APIs', 'MySQL', 'MongoDB'],
  },
  {
    category: 'Tools',
    items: ['Git', 'Docker', 'Figma', 'CI/CD'],
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="px-5 sm:px-8 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-14 sm:mb-20">
            Technical Stack
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
            {skillGroups.map((group, groupIndex) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: 0.1 + groupIndex * 0.08 }}
              >
                <h3
                  className="text-xs uppercase tracking-widest mb-5 pb-3 border-b"
                  style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                >
                  {group.category}
                </h3>

                <ul className="space-y-2.5">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="text-base"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
