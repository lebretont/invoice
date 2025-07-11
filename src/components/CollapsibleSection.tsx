import { css } from '#styled-system/css';
import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={css({
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid #e5e7eb'
    })}>
      <button
        onClick={toggleExpanded}
        className={css({
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: '#1f2937',
          _hover: {
            color: '#3b82f6'
          }
        })}
      >
        <span>{title}</span>
        <span className={css({
          fontSize: 'lg',
          transition: 'transform 0.2s',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        })}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className={css({
          marginTop: '1rem'
        })}>
          {children}
        </div>
      )}
    </div>
  );
}