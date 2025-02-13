'use client';
import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  containerClassName?: string;
  maxWidth?: boolean;
  background?: 'white' | 'gray' | 'maroon';
}

export default function Section({
  title,
  children,
  action,
  className = '',
  containerClassName = '',
  maxWidth = true,
  background = 'white'
}: SectionProps) {
  const getBgColor = () => {
    switch (background) {
      case 'gray':
        return 'bg-gray-50';
      case 'maroon':
        return 'bg-maroon text-white';
      default:
        return 'bg-white';
    }
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium">{title}</h2>
        {action && (
          action.href ? (
            <a href={action.href} className="text-maroon hover:underline font-medium">
              {action.text}
            </a>
          ) : (
            <button onClick={action.onClick} className="text-maroon hover:underline font-medium">
              {action.text}
            </button>
          )
        )}
      </div>
      {children}
    </>
  );

  return (
    <section className={`py-16 px-4 md:px-8 ${getBgColor()} ${className}`}>
      {maxWidth ? (
        <div className={`max-w-6xl mx-auto ${containerClassName}`}>
          {content}
        </div>
      ) : (
        content
      )}
    </section>
  );
};