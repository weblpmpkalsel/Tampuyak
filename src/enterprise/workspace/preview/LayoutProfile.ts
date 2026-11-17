import React, { createContext } from 'react';

export interface LayoutProfile {
  coverLogoScale: number;
  coverTopOffset: number;
  approvalSignatureHeight: number;
  approvalColumnGap: number;
  paragraphSpacing: number;
}

export const defaultLayoutProfile: LayoutProfile = {
  coverLogoScale: 1,
  coverTopOffset: 0,
  approvalSignatureHeight: 3.5,
  approvalColumnGap: 2,
  paragraphSpacing: 0,
};

export const LayoutProfileContext = createContext<LayoutProfile>(defaultLayoutProfile);
