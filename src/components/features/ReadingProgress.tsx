import type { WikiSection } from '../../types/WikiTypes';

interface ReadingProgressProps {
  currentSubsection: string;
  totalSubsections: number;
  subsections: WikiSection[];
}

const ReadingProgress = ({
  currentSubsection,
  totalSubsections,
  subsections,
}: ReadingProgressProps) => {
  if (totalSubsections === 0) return null;

  const currentIndex = subsections.findIndex((sub: WikiSection) => sub.id === currentSubsection);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / totalSubsections) * 100 : 0;

  return (
    <div className="reading-progress">
      <div className="reading-progress-bar">
        <div className="reading-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="reading-progress-text">
        {currentIndex >= 0 ? currentIndex + 1 : 0} из {totalSubsections}
      </div>
    </div>
  );
};

export default ReadingProgress;
