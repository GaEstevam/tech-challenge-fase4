// src/utils/themes.ts

const themes: Record<number, string> = {
  1: 'Exatas',
  2: 'Humanas',
  3: 'Biológicas',
  4: 'Multidisciplinar',
};

export const getThemeName = (themeid: number): string => {
  return themes[themeid] || 'Tema desconhecido';
};
