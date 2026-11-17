export class FallbackPaginationEngine {
  static estimatePages(document: any): Record<string, string> {
    const map: Record<string, string> = {};
    let pageCounter = 1;
    let romanCounter = 1;

    const toRoman = (num: number) => {
      const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
      return roman[num - 1] || 'i';
    };

    document.sections?.forEach((sec: any) => {
      let pageStr = '';
      const normalizedId = sec.chapterId ? sec.chapterId.toLowerCase().replace('front_matter_', '') : '';
      
      if (normalizedId === 'cover') {
        pageStr = '';
      } else if (['approval', 'toc', 'team', 'preface'].includes(normalizedId)) {
        pageStr = toRoman(romanCounter++);
      } else {
        pageStr = String(pageCounter++);
      }

      if (sec.chapterId) map[sec.chapterId] = pageStr;
      if (sec.id) map[sec.id] = pageStr;

      const mapHeadings = (blocks: any[]) => {
        blocks?.forEach(block => {
          if (block.type === 'HEADING') {
            map[block.id] = pageStr;
          } else if (block.type === 'CONTAINER' && block.blocks) {
            mapHeadings(block.blocks);
          }
        });
      };
      
      if (sec.blocks) {
        mapHeadings(sec.blocks);
      }
    });
    return map;
  }
}
