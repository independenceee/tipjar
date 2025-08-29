"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }: Props) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null;
    }
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">First</span>
                    <span className="sm:hidden">1</span>
                </Button>

                <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">←</span>
                </Button>
            </div>

            <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {currentPage} of {totalPages}
            </span>

            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-800 dark:hover:text-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">→</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-800 dark:hover:text-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                >
                    <span className="hidden sm:inline">Last</span>
                    <span className="sm:hidden">{totalPages}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
