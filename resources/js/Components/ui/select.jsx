import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({ children, value, onValueChange }) {
    return (
        <div className="relative">
            {children({value, onValueChange})}
        </div>
    );
}

export function SelectTrigger({ children, className = '' }) {
    return (
        <button className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between hover:bg-gray-50 ${className}`}>
            {children}
            <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
    );
}

export function SelectValue({ placeholder = '' }) {
    return <span className="text-gray-700">{placeholder}</span>;
}

export function SelectContent({ children }) {
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {children}
        </div>
    );
}

export function SelectItem({ value, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b last:border-b-0"
        >
            {children}
        </button>
    );
}
