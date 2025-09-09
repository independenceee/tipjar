"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, ExternalLink, X } from "lucide-react";
import { docCategories, DocCategory, DocSidebarProps } from "~/constants/docs";
import { useState } from "react";

export default function DocSidebar({ onClose }: DocSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "new-to-cardano",
    "learn",
    "explore-more",
    "cardano-evolution"
  ]);

  const isActive = (href: string) => {
    if (pathname === "/docs" && href === "/docs/introduction") {
      return true;
    }
    return pathname === href;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => {
    return expandedSections.includes(sectionId);
  };

  return (
    <aside 
      className="w-80 bg-gray-50 border-r border-gray-200 p-4 lg:p-6 sticky top-0 h-screen overflow-y-auto"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style jsx>{`
        aside::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      

      
        <nav className="space-y-1">
          {docCategories.map((category: DocCategory) => (
          <div key={category.id} className="mb-4 lg:mb-6">
              {category.title && (
              <h3 className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 lg:mb-3">
                  {category.title}
                </h3>
              )}
              <ul className="space-y-1">
                {category.expandable ? (
                  <li>
                    <button
                      onClick={() => toggleSection(category.id)}
                    className="flex items-center justify-between w-full px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      <span className="font-medium">{category.title}</span>
                      {isExpanded(category.id) ? (
                      <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                      ) : (
                      <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                      )}
                    </button>
                    {isExpanded(category.id) && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {category.sections.map((section) => (
                          <li key={section.id}>
                            <Link
                              href={section.href}
                            onClick={onClose}
                            className={`block px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm rounded transition-colors ${
                                isActive(section.href)
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {section.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  category.sections.map((section) => (
                    <li key={section.id}>
                      <Link
                        href={section.href}
                        target={section.external ? "_blank" : undefined}
                        rel={section.external ? "noopener noreferrer" : undefined}
                      onClick={onClose}
                      className={`flex items-center px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm rounded transition-colors ${
                          isActive(section.href)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex-1">{section.title}</span>
                        {section.external && (
                        <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4 ml-2" />
                        )}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </nav>
    </aside>
  );
} 