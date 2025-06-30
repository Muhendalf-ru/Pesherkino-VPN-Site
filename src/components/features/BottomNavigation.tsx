import { motion } from 'framer-motion';
import { wikiData } from '../../data/wikiData';
import type { WikiSection } from '../../types/WikiTypes';

interface BottomNavigationProps {
  currentSection: WikiSection;
  currentSubsection: WikiSection | null;
  onNavigate: (sectionId: string, subsectionId?: string) => void;
}

const BottomNavigation = ({
  currentSection,
  currentSubsection,
  onNavigate,
}: BottomNavigationProps) => {
  // Получаем все разделы и подразделы в плоском списке для навигации
  const getAllItems = () => {
    const items: Array<{
      type: 'section' | 'subsection';
      section: WikiSection;
      subsection?: WikiSection;
    }> = [];

    wikiData.forEach((section) => {
      // Добавляем раздел
      items.push({ type: 'section', section });

      // Добавляем подразделы раздела
      if (section.subsections) {
        section.subsections.forEach((subsection) => {
          items.push({ type: 'subsection', section, subsection });
        });
      }
    });

    return items;
  };

  const allItems = getAllItems();
  const currentIndex = allItems.findIndex((item) => {
    if (currentSubsection) {
      return (
        item.type === 'subsection' &&
        item.section.id === currentSection.id &&
        item.subsection?.id === currentSubsection.id
      );
    } else {
      return item.type === 'section' && item.section.id === currentSection.id;
    }
  });

  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const handlePrevClick = () => {
    if (prevItem) {
      if (prevItem.type === 'subsection' && prevItem.subsection) {
        onNavigate(prevItem.section.id, prevItem.subsection.id);
      } else {
        onNavigate(prevItem.section.id);
      }
    }
  };

  const handleNextClick = () => {
    if (nextItem) {
      if (nextItem.type === 'subsection' && nextItem.subsection) {
        onNavigate(nextItem.section.id, nextItem.subsection.id);
      } else {
        onNavigate(nextItem.section.id);
      }
    }
  };

  if (!prevItem && !nextItem) return null;

  return (
    <div className="bottom-navigation">
      <div className="bottom-navigation-container">
        {prevItem && (
          <motion.button
            className="nav-button nav-button-prev"
            onClick={handlePrevClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="nav-button-content">
              <div className="nav-button-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </div>
              <div className="nav-button-text">
                <div className="nav-button-label">Назад</div>
                <div className="nav-button-title">
                  {prevItem.type === 'subsection' && prevItem.subsection
                    ? `${prevItem.section.title} > ${prevItem.subsection.title}`
                    : prevItem.section.title}
                </div>
              </div>
            </div>
          </motion.button>
        )}

        {nextItem && (
          <motion.button
            className="nav-button nav-button-next"
            onClick={handleNextClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="nav-button-content">
              <div className="nav-button-text">
                <div className="nav-button-label">Вперед</div>
                <div className="nav-button-title">
                  {nextItem.type === 'subsection' && nextItem.subsection
                    ? `${nextItem.section.title} > ${nextItem.subsection.title}`
                    : nextItem.section.title}
                </div>
              </div>
              <div className="nav-button-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
