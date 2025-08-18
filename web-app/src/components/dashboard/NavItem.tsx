'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './css/NavItem.module.css';

export interface NavItemData {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavItemProps {
  item: NavItemData;
  variant: 'sidebar' | 'tabbar';
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  item, 
  variant, 
  collapsed = false, 
  onClick 
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === item.path;

  const handleClick = () => {
    router.push(item.path);
    onClick?.();
  };

  const getVariantClasses = () => {
    const baseClass = styles.navItem;
    const variantClass = variant === 'sidebar' ? styles.sidebarItem : styles.tabbarItem;
    const activeClass = isActive ? styles.active : '';
    const collapsedClass = collapsed ? styles.collapsed : '';
    
    return `${baseClass} ${variantClass} ${activeClass} ${collapsedClass}`.trim();
  };

  return (
    <button
      className={getVariantClasses()}
      onClick={handleClick}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
    >
      <span className={styles.iconContainer}>
        {item.icon}
        {item.badge && item.badge > 0 && (
          <span className={styles.badge} aria-label={`${item.badge} notifications`}>
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </span>
      
      {!collapsed && (
        <span className={styles.label}>
          {item.label}
        </span>
      )}
      
      {variant === 'tabbar' && (
        <span className={styles.tabbarLabel}>
          {item.label}
        </span>
      )}
    </button>
  );
};

export default NavItem;