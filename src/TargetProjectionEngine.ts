export class TargetProjectionEngine {
  public static calculateProjections(baseline: number, target: number): { y1: number, y2: number, y3: number, y4: number } {
    if (baseline >= target) return { y1: target, y2: target, y3: target, y4: target };
    const gap = target - baseline;
    // Standard linear progression for 4 years
    const step = Math.round(gap / 4);
    
    let y1 = baseline + step;
    let y2 = y1 + step;
    let y3 = y2 + step;
    let y4 = target; // Ensure y4 matches target exactly
    
    // Prevent exceeding target
    y1 = Math.min(y1, target);
    y2 = Math.min(y2, target);
    y3 = Math.min(y3, target);
    
    return { y1, y2, y3, y4 };
  }
}
