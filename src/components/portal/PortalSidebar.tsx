'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type IconName =
  | 'grid'
  | 'users'
  | 'user'
  | 'cap'
  | 'folder'
  | 'document'
  | 'link'
  | 'chart'
  | 'check'
  | 'flag'
  | 'chartPie'
  | 'shield'
  | 'cog'
  | 'chat'
  | 'bell';

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  grid: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  cap: <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />,
  folder: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />,
  document: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  link: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m5.656-5.656l1.5-1.5a4 4 0 115.656 5.656l-3 3a4 4 0 01-5.656 0" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a1 1 0 00-1-1H5a1 1 0 00-1 1v6a1 1 0 001 1h3a1 1 0 001-1zm6 0V9a1 1 0 00-1-1h-3a1 1 0 00-1 1v10a1 1 0 001 1h3a1 1 0 001-1zm6 0V5a1 1 0 00-1-1h-3a1 1 0 00-1 1v14a1 1 0 001 1h3a1 1 0 001-1z" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  flag: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-9m0 0V4a1 1 0 011-1h1.5a2 2 0 011.6.8l.4.533a2 2 0 001.6.8H17a1 1 0 011 1v7a1 1 0 01-1 1h-6.9a2 2 0 00-1.6.8l-.4.533a2 2 0 01-1.6.8H4a1 1 0 01-1-1z" />,
  chartPie: <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7l7.5 3v5.25c0 4.556-3.163 8.75-7.5 9.75-4.337-1-7.5-5.194-7.5-9.75V5.75L12 2.75z" />,
  cog: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  bell: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
};

function Icon({ name, className = 'w-4 h-4' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      {ICON_PATHS[name]}
    </svg>
  );
}

export interface NavLink {
  type: 'link';
  label: string;
  href: string;
  icon: IconName;
}

export interface NavGroup {
  type: 'group';
  label: string;
  icon: IconName;
  children: { label: string; href: string }[];
}

export type NavItem = NavLink | NavGroup;

function GroupItem({ group, builtRoutes }: { group: NavGroup; builtRoutes: Set<string> }) {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
      >
        <Icon name={group.icon} className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {open && (
        <div className="mt-0.5 ml-[26px] pl-3 border-l border-gray-200 space-y-0.5">
          {group.children.map((child) => (
            <SidebarItem key={child.href} label={child.label} href={child.href} sub builtRoutes={builtRoutes} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItem({
  label,
  href,
  icon,
  sub = false,
  builtRoutes,
}: {
  label: string;
  href: string;
  icon?: IconName;
  sub?: boolean;
  builtRoutes: Set<string>;
}) {
  const pathname = usePathname();
  const isBuilt = builtRoutes.has(href);
  const isActive = isBuilt && pathname === href;

  const baseClasses = `w-full flex items-center gap-2.5 rounded-lg text-sm transition-colors duration-150 ${
    sub ? 'px-3 py-1.5 text-[13px]' : 'px-3 py-2 font-medium'
  }`;

  if (!isBuilt) {
    return (
      <div className={`${baseClasses} text-gray-400 cursor-default justify-between`}>
        <span className="flex items-center gap-2.5">
          {icon && <Icon name={icon} className="w-4 h-4 text-gray-300 flex-shrink-0" />}
          <span>{label}</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-300 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
          Soon
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${
        isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
      }`}
    >
      {icon && <Icon name={icon} className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />}
      <span>{label}</span>
    </Link>
  );
}

/**
 * Config-driven sidebar shared by every /portal/<role> section. `builtRoutes`
 * decides which hrefs render as real links vs. a disabled "Soon" row — keep
 * it in sync with which page.tsx files actually exist.
 */
export default function PortalSidebar({ nav, builtRoutes }: { nav: NavItem[]; builtRoutes: Set<string> }) {
  return (
    <nav className="space-y-1">
      {nav.map((item) =>
        item.type === 'group' ? (
          <GroupItem key={item.label} group={item} builtRoutes={builtRoutes} />
        ) : (
          <SidebarItem key={item.href} label={item.label} href={item.href} icon={item.icon} builtRoutes={builtRoutes} />
        )
      )}
    </nav>
  );
}
