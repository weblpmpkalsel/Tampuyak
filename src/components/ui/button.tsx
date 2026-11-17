import React from 'react';

export const Button = ({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}: any) => {
  const baseStyle = "enterprise-btn";
  const variants: any = {
    primary: "enterprise-btn-primary",
    secondary: "enterprise-btn-secondary",
    danger: "enterprise-btn-danger",
    success: "enterprise-btn-primary",
    warning: "enterprise-btn-primary",
    outline: "enterprise-btn-secondary",
    ghost: "enterprise-btn-secondary border-transparent shadow-none"
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};
