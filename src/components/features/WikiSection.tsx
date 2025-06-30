import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WikiSection as WikiSectionType } from '../../types/WikiTypes';

interface WikiSectionProps {
  title: string;
  items: WikiSectionType[];
}

const WikiSection: React.FC<WikiSectionProps> = ({ title, items }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <motion.div
      className="wiki-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h2 className="wiki-section-title">{title}</h2>
      <div className="wiki-items">
        {items.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          return (
            <motion.div
              key={index}
              className="wiki-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}>
              <button className="wiki-item-header" onClick={() => toggleItem(index)}>
                <span className="wiki-item-title">{item.title}</span>
                <span className={`wiki-item-icon ${isExpanded ? 'expanded' : ''}`}>
                  {isExpanded ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="wiki-item-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}>
                    <div
                      className="wiki-item-description"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WikiSection;
