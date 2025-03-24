import { 
    UtensilsCrossed, 
    Home, 
    Car, 
    Plane, 
    Film, 
    Cable, 
    Heart, 
    GraduationCap, 
    User, 
    ShoppingBag, 
    HelpCircle,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    DollarSign
} from 'lucide-react';

// Standard category colors - consistent across the app
export const categoryColors = {
    'Food': '#ef4444',      // Red
    'Housing': '#f97316',   // Orange
    'Transport': '#f59e0b', // Amber
    'Travel': '#10b981',    // Emerald
    'Entertainment': '#3b82f6', // Blue
    'Utilities': '#8b5cf6', // Violet
    'Health': '#ec4899',    // Pink
    'Education': '#6366f1', // Indigo
    'Personal': '#14b8a6',  // Teal
    'Shopping': '#a855f7',  // Purple
    'Other': '#64748b'      // Slate
};

// Category icons using Lucide React
export const categoryIcons = {
    'Food': <UtensilsCrossed size={18} />,
    'Housing': <Home size={18} />,
    'Transport': <Car size={18} />,
    'Travel': <Plane size={18} />,
    'Entertainment': <Film size={18} />,
    'Utilities': <Cable size={18} />,
    'Health': <Heart size={18} />,
    'Education': <GraduationCap size={18} />,
    'Personal': <User size={18} />,
    'Shopping': <ShoppingBag size={18} />,
    'Other': <HelpCircle size={18} />
};

// Status icons
export const statusIcons = {
    'Over Budget': <TrendingUp size={18} />,
    'At Budget': <AlertCircle size={18} />,
    'Under Budget': <TrendingDown size={18} />,
    'No Data': <DollarSign size={18} />
};

// Function to get color by category (with fallback)
export const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors['Other'];
};

// Function to get budget status color
// Function to get budget status color with more detailed gradients
export const getBudgetStatusColor = (percentage) => {
    // Critical - Significantly Over Budget (>= 120%)
    if (percentage >= 120) {
        return 'bg-gradient-to-r from-red-500 to-rose-600';
    }
    
    // Over Budget (100-119%)
    if (percentage >= 100) {
        return 'bg-gradient-to-r from-red-500 to-rose-600';
    }
    
    // Very Close to Budget (90-99%)
    if (percentage >= 90) {
        return 'bg-gradient-to-r from-amber-500 to-orange-600';
    }
    
    // Approaching Budget (80-89%)
    if (percentage >= 80) {
        return 'bg-gradient-to-r from-amber-400 to-orange-500';
    }
    
    // Moderate Usage (60-79%)
    if (percentage >= 60) {
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
    }
    
    // Low Usage (40-59%)
    if (percentage >= 40) {
        return 'bg-gradient-to-r from-teal-400 to-green-500';
    }
    
    // Very Low Usage (20-39%)
    if (percentage >= 20) {
        return 'bg-gradient-to-r from-cyan-500 to-teal-600';
    }
    
    // Minimal Usage (<20%)
    return 'bg-gradient-to-r from-blue-500 to-indigo-600';
};
// Gradient with category color and purple
export const getCategoryGradient = (category) => {
    const color = getCategoryColor(category);
    return `linear-gradient(to right, ${color}, #a855f7)`;
};

// Budget status text based on percentage
export const getBudgetStatusText = (percentage) => {
    if (percentage > 100) return 'Over Budget';
    if (percentage === 100) return 'At Budget';
    if (percentage >= 80) return 'Near Budget';
    return 'Under Budget';
};

// Standard list of all categories (for forms, validation, etc.)
export const standardCategories = [
    'Food', 'Housing', 'Transport', 'Travel', 'Entertainment', 
    'Utilities', 'Health', 'Education', 'Personal', 'Shopping', 'Other'
];

// Period utils
export const getPeriodDisplay = (period) => {
    const displays = {
        'daily': 'Daily',
        'weekly': 'Weekly',
        'monthly': 'Monthly',
        'quarterly': 'Quarterly',
        'yearly': 'Yearly'
    };
    return displays[period] || period;
};