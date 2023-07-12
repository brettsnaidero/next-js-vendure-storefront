import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/solid';
import styles from '@/styles/components/expander.module.css';

const Expander = ({
  title,
  titleExpanded,
  children,
  initial,
}: {
  title: string;
  children: React.ReactNode;
  titleExpanded?: string;
  initial?: boolean;
}) => {
  const [isOpen, setOpen] = useState(initial ?? false);

  const toggleOpen = () => setOpen(!isOpen);

  return (
    <>
      <button type="button" onClick={toggleOpen} className={styles.toggle}>
        <span>{titleExpanded && isOpen ? titleExpanded : title}</span>

        {isOpen ? (
          <MinusSmallIcon width={20} height={20} />
        ) : (
          <PlusSmallIcon width={20} height={20} />
        )}
      </button>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="children"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Expander;
