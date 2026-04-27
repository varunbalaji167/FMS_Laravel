import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ children, className = '' }) {
    return (
        <nav className={`flex items-center justify-center gap-2 ${className}`}>
            {children}
        </nav>
    );
}

export function PaginationContent({ children }) {
    return <div className="flex items-center gap-1">{children}</div>;
}

export function PaginationItem({ children }) {
    return <>{children}</>;
}

export function PaginationLink({ href, isActive, children, ...props }) {
    const baseClass = 'px-3 py-1 rounded text-sm font-medium transition';
    const activeClass = isActive
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

    if (href) {
        return (
            <a href={href} className={`${baseClass} ${activeClass}`} {...props}>
                {children}
            </a>
        );
    }

    return (
        <span className={`${baseClass} ${activeClass}`} {...props}>
            {children}
        </span>
    );
}

export function PaginationPrevious({ href, ...props }) {
    return (
        <PaginationLink href={href} {...props}>
            <ChevronLeft className="w-4 h-4" />
            <span className="ml-1">Previous</span>
        </PaginationLink>
    );
}

export function PaginationNext({ href, ...props }) {
    return (
        <PaginationLink href={href} {...props}>
            <span className="mr-1">Next</span>
            <ChevronRight className="w-4 h-4" />
        </PaginationLink>
    );
}
