import React from 'react';
import Image from 'next/image';

interface WaveLogoProps {
  size?: number;
  className?: string;
}

export function WaveLogo({ size = 48, className }: WaveLogoProps) {
  return (
    <Image
      src="/wave-logo-transparent.png"
      alt="Wavecord Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
