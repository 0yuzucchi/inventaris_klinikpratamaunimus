import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    const baseClasses = 'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150';
    
    const activeClasses = 'font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/50';
    
    const inactiveClasses = 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300';

    return (
        <Link
            {...props}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}`}
        >
            {children}
        </Link>
    );
}