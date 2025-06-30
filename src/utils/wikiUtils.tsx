import { wikiData } from '../data/wikiData';
import type { SearchResult } from '../types/WikiTypes';
import React from 'react';
import { CodeBlock } from '../components/ui';

// Функция для рендеринга HTML с поддержкой блоков кода
export const renderContentWithCodeBlocks = (htmlContent: string) => {
  // Находим все блоки кода и заменяем их на компоненты
  const codeBlockRegex =
    /<div class="code-block">\s*<pre><code>([\s\S]*?)<\/code><\/pre>\s*<\/div>/g;

  // Проверяем, есть ли блоки кода в контенте
  const hasCodeBlocks = codeBlockRegex.test(htmlContent);
  console.log('Has code blocks:', hasCodeBlocks);

  if (!hasCodeBlocks) {
    // Если блоков кода нет, просто возвращаем обычный HTML
    return <div className="content-html" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }

  // Сбрасываем регулярное выражение
  codeBlockRegex.lastIndex = 0;

  const parts = htmlContent.split(codeBlockRegex);
  const result = [];

  console.log('Parts length:', parts.length);

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Обычный HTML контент
      if (parts[i].trim()) {
        result.push(
          <div
            key={`html-${i}`}
            className="content-html"
            dangerouslySetInnerHTML={{ __html: parts[i] }}
          />,
        );
      }
    } else {
      // Блок кода
      console.log('Code block found:', parts[i].substring(0, 100) + '...');
      result.push(<CodeBlock key={`code-${i}`}>{parts[i]}</CodeBlock>);
    }
  }

  return result;
};

// Функция поиска в стиле GitBook
export const performSearch = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  wikiData.forEach((section) => {
    // Поиск в заголовке раздела
    if (section.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        matchedText: section.title,
        context: section.title,
        type: 'section',
      });
    }

    // Поиск в подразделах
    if (section.subsections) {
      section.subsections.forEach((subsection) => {
        if (subsection.title.toLowerCase().includes(lowerQuery)) {
          results.push({
            sectionId: section.id,
            sectionTitle: section.title,
            subsectionId: subsection.id,
            subsectionTitle: subsection.title,
            matchedText: subsection.title,
            context: `${section.title} > ${subsection.title}`,
            type: 'subsection',
          });
        }

        // Поиск в содержимом подраздела
        const contentMatch = findContentMatches(subsection.content, lowerQuery);
        contentMatch.forEach((match) => {
          results.push({
            sectionId: section.id,
            sectionTitle: section.title,
            subsectionId: subsection.id,
            subsectionTitle: subsection.title,
            matchedText: match.text,
            context: match.context,
            type: 'content',
          });
        });
      });
    }

    // Поиск в содержимом раздела
    const contentMatch = findContentMatches(section.content, lowerQuery);
    contentMatch.forEach((match) => {
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        matchedText: match.text,
        context: match.context,
        type: 'content',
      });
    });
  });

  return results.slice(0, 10); // Ограничиваем 10 результатами
};

// Функция поиска совпадений в HTML-контенте
export const findContentMatches = (
  htmlContent: string,
  query: string,
): Array<{ text: string; context: string }> => {
  const matches: Array<{ text: string; context: string }> = [];

  // Убираем HTML-теги для поиска
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
  const sentences = textContent.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase();
    if (lowerSentence.includes(query)) {
      const startIndex = lowerSentence.indexOf(query);
      const endIndex = startIndex + query.length;

      // Получаем контекст вокруг совпадения
      const contextStart = Math.max(0, startIndex - 50);
      const contextEnd = Math.min(sentence.length, endIndex + 50);
      let context = sentence.substring(contextStart, contextEnd);

      // Добавляем многоточие если обрезали
      if (contextStart > 0) context = '...' + context;
      if (contextEnd < sentence.length) context = context + '...';

      // Выделяем совпадающий текст
      const matchStart = startIndex - contextStart;
      const matchEnd = endIndex - contextStart;
      const matchedText = context.substring(matchStart, matchEnd);

      matches.push({
        text: matchedText,
        context: context,
      });
    }
  });

  return matches;
};

// Подсветка совпадений в тексте
export const highlightMatches = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Проверяем, является ли часть совпадением (регистронезависимо)
    const isMatch = query.toLowerCase() === part.toLowerCase();

    return isMatch ? (
      <mark
        key={index}
        style={{
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '4px',
          padding: '0 5px',
          fontWeight: 500,
          boxShadow: 'none',
        }}>
        {part}
      </mark>
    ) : (
      part
    );
  });
};
