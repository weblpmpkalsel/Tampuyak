export class NarrativeFormatter {
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
  }

  cleanSpacing(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  ensurePunctuation(text: string): string {
    if (!text) return text;
    const trimmed = text.trim();
    if (!/[.!?]$/.test(trimmed)) {
      return trimmed + '.';
    }
    return trimmed;
  }
}
