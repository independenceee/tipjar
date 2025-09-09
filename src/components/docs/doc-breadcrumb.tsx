import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DocBreadcrumbProps } from '~/constants/docs';

export default function DocBreadcrumb({ items }: DocBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm lg:text-base mb-6 lg:mb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
} 