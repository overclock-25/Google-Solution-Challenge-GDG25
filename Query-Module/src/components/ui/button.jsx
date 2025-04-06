import * as React from "react"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  disabled, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    "outline-success": "border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.default;
  
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`;
  
  return (
    <button 
      className={allClasses}
      disabled={disabled} 
      ref={ref} 
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };