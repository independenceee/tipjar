"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye, Heart, User } from 'lucide-react';
import { DocDocument, DocListItemProps } from '~/constants/docs';

export default function DocListItem({ document, onNavigate }: DocListItemProps) {



  return (
    <motion.div
      onClick={() => onNavigate(document.id)}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b-2 border-white/20 py-6 transition-colors duration-500 hover:border-blue-400 cursor-pointer"
    >
      <div className="flex-1">
        <motion.div
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: "spring" }}
              className="text-3xl font-bold text-white transition-colors duration-500 group-hover:text-blue-400 md:text-4xl"
            >
              {document.name}
            </motion.span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-gray-300 font-sans">{document.documentCode}</span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{document.readTime}</span>
            </div>
          </div>
          <span className="relative z-10 block text-base text-gray-300 transition-colors duration-500 group-hover:text-gray-100 font-sans">
            {document.description}
          </span>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <User className="h-4 w-4" />
              <span>{document.author}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Eye className="h-4 w-4" />
              <span>{document.views}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Heart className="h-4 w-4" />
              <span>{document.likes}</span>
            </div>
            <div className="text-sm text-gray-500">
              Updated: {new Date(document.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      </div>



      <motion.div
        variants={{
          initial: {
            x: "25%",
            opacity: 0,
          },
          whileHover: {
            x: "0%",
            opacity: 1,
          },
        }}
        transition={{ type: "spring" }}
        className="relative z-10 p-4"
      >
        <ArrowRight className="text-4xl text-blue-400" />
      </motion.div>
    </motion.div>
  );
} 