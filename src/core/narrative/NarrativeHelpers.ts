export const NarrativeHelpers = {
  getTransitionWord(index: number, total: number): string {
    if (index === 0) return 'Pertama, ';
    if (index === total - 1) return 'Terakhir, ';
    const middleWords = ['Selain itu, ', 'Selanjutnya, ', 'Kemudian, '];
    return middleWords[(index - 1) % middleWords.length];
  },
  
  composeListAsSentence(items: string[]): string {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} dan ${items[1]}`;
    const initial = items.slice(0, -1).join(', ');
    return `${initial}, dan ${items[items.length - 1]}`;
  }
};
