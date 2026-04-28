import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  ...props,
  size: undefined,
});

export function HashIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M9 3L7 21M17 3L15 21M4 9H21M3 15H20"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function VolumeIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M5 8.5H8.5L13 5V19L8.5 15.5H5V8.5Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 8.5C17.1 9.6 17.8 11.2 17.8 12.5C17.8 13.8 17.1 15.4 16 16.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 6C20.3 7.8 21.4 10.1 21.4 12.5C21.4 14.9 20.3 17.2 18.5 19"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MicIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="9" y="2" width="6" height="11" rx="3"
        stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 10C5 14.4 8.1 18 12 18C15.9 18 19 14.4 19 10"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="22" x2="16" y2="22"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MicOffIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M9 5.5V13C9 14.7 10.3 16 12 16C13.2 16 14.2 15.3 14.7 14.3"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 9.5V7C15 5.3 13.7 4 12 4C10.9 4 9.9 4.6 9.4 5.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 10C5 14.4 8.1 18 12 18C12.9 18 13.8 17.8 14.6 17.4"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17.7 14.1C18.5 12.9 19 11.5 19 10"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="22" x2="16" y2="22"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="3" x2="21" y2="21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HeadphonesIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 18V12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12V18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="2" y="15" width="4" height="6" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <rect x="18" y="15" width="4" height="6" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function HeadphonesOffIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 18V12C3 7.03 7.03 3 12 3C14.2 3 16.2 3.8 17.7 5.2"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.5 8.7C21 9.8 21 11 21 12V18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="2" y="15" width="4" height="6" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <rect x="18" y="15" width="4" height="6" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <line x1="3" y1="3" x2="21" y2="21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CameraIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M15.5 7H5C3.9 7 3 7.9 3 9V17C3 18.1 3.9 19 5 19H15C16.1 19 17 18.1 17 17V9C17 7.9 16.2 7 15.2 7"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 10L21 8V16L17 14"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="10" cy="13" r="2.5"
        stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function CameraOffIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M8 7H15C16.1 7 17 7.9 17 9V10M17 14V17C17 18.1 16.1 19 15 19H5C3.9 19 3 18.1 3 17V9C3 8.4 3.3 7.9 3.7 7.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 10L21 8V16L17 14"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="3" y1="3" x2="21" y2="21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ScreenShareIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="2" y="4" width="20" height="14" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 22H16M12 18V22"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 12L12 9L15 12"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="15"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="3"
        stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function PlusIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <line x1="12" y1="5" x2="12" y2="19"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LeaveIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M9 21H5C4.5 21 4 20.6 4 20V4C4 3.5 4.5 3 5 3H9"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <polyline points="16 17 21 12 16 7"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function KickIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 21C3 17.7 5.7 15 9 15H10"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="15" y1="17" x2="21" y2="17"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BanIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <line x1="16.5" y1="16.5" x2="21" y2="21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BellOffIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M8.56 2.9A6 6 0 0118 8c0 2.5-.7 4.5-1.5 6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.15 6.15C6.05 6.75 6 7.4 6 8c0 7-3 9-3 9h14"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="3" x2="21" y2="21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FriendsIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 21C3 17.7 5.7 15 9 15C12.3 15 15 17.7 15 21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 3.1C17.9 3.6 19.3 5.3 19.3 7.3C19.3 9.3 17.9 11 16 11.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 21C21 18.2 19.5 15.8 17.2 14.6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function InboxIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <polyline points="22 13 16 13 14 16 10 16 8 13 2 13"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5.5 4.2L2 13V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V13L18.5 4.2C18.2 3.5 17.5 3 16.7 3H7.3C6.5 3 5.8 3.5 5.5 4.2Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <polyline points="6 9 12 15 18 9"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <polyline points="9 18 15 12 9 6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EditIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M11 4H4C3.5 4 3 4.5 3 5V20C3 20.5 3.5 21 4 21H19C19.5 21 20 20.5 20 20V13"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <polyline points="3 6 5 6 21 6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 6L18.1 19.1C18 20.2 17.1 21 16 21H8C6.9 21 6 20.2 5.9 19.1L5 6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 11V17M14 11V17"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 6V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CopyIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="9" y="9" width="13" height="13" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <polyline points="20 6 9 17 4 12"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <line x1="18" y1="6" x2="6" y2="18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CrownIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 18H21M3 18L6 8L10.5 13L12 10L13.5 13L18 8L21 18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 2L4 5.5V11C4 15.4 7.4 19.5 12 21C16.6 19.5 20 15.4 20 11V5.5L12 2Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="9 12 11 14 15 10"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmojiIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 14.5C9.2 15.8 10.5 16.5 12 16.5C13.5 16.5 14.8 15.8 15.5 14.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export function AttachIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M21 11.5L12.5 20C10.6 21.9 7.5 21.9 5.6 20C3.7 18.1 3.7 15 5.6 13.1L14.1 4.6C15.4 3.3 17.5 3.3 18.8 4.6C20.1 5.9 20.1 8 18.8 9.3L10.3 17.8C9.6 18.5 8.5 18.5 7.8 17.8C7.1 17.1 7.1 16 7.8 15.3L15.5 7.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ReplyIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M9 17L4 12L9 7" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12H14C17.3 12 20 14.7 20 18V19"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MoreIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ServerIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="2" y="3" width="20" height="7" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <rect x="2" y="14" width="20" height="7" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="6.5" r="1" fill="currentColor" />
      <circle cx="6" cy="17.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function LinkIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ImageIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <rect x="3" y="3" width="18" height="18" rx="2"
        stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <polyline points="21 15 16 10 5 21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <line x1="3" y1="6" x2="21" y2="6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PersonIcon({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 21C4 17.7 7.6 15 12 15C16.4 15 20 17.7 20 21"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
