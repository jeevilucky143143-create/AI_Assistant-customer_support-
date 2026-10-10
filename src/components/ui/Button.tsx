import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyle =
    'relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  let sizeStyle = 'px-4 py-2 text-sm';
  if (size === 'sm') sizeStyle = 'px-3 py-1.5 text-xs';
  if (size === 'lg') sizeStyle = 'px-6 py-3 text-base';

  let variantStyle = 'bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-sm';
  if (variant === 'secondary') {
    variantStyle =
      'bg-[#1F1F27] text-white hover:bg-[#2A2A35] border border-white/10 active:scale-[0.98]';
  } else if (variant === 'outline') {
    variantStyle =
      'bg-transparent text-white/90 hover:text-white border border-white/15 hover:border-white/30 hover:bg-white/5 active:scale-[0.98]';
  } else if (variant === 'ghost') {
    variantStyle = 'bg-transparent text-white/70 hover:text-white hover:bg-white/5';
  } else if (variant === 'danger') {
    variantStyle =
      'bg-rose-600/90 text-white hover:bg-rose-600 border border-rose-500/30 active:scale-[0.98]';
  } else if (variant === 'success') {
    variantStyle =
      'bg-emerald-600/90 text-white hover:bg-emerald-600 border border-emerald-500/30 active:scale-[0.98]';
  }

  return (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
