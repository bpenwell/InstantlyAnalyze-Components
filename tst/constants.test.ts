import { CHART_COLORS } from '../src/constants';

describe('Constants', () => {
  describe('CHART_COLORS', () => {
    it('should export chart colors object', () => {
      expect(CHART_COLORS).toBeDefined();
      expect(typeof CHART_COLORS).toBe('object');
    });

    it('should have mainGreen color', () => {
      expect(CHART_COLORS.mainGreen).toBe('#004A00');
    });

    it('should have complementaryRed color', () => {
      expect(CHART_COLORS.complementaryRed).toBe('#A40000');
    });

    it('should have cashFlowBlack color', () => {
      expect(CHART_COLORS.cashFlowBlack).toBe('#000000');
    });

    it('should have variableExpensesOrange color', () => {
      expect(CHART_COLORS.variableExpensesOrange).toBe('#E69F00');
    });

    it('should have all required color properties', () => {
      const expectedColors = [
        'mainGreen',
        'complementaryRed', 
        'cashFlowBlack',
        'variableExpensesOrange'
      ];

      expectedColors.forEach(color => {
        expect(CHART_COLORS).toHaveProperty(color);
        expect(typeof CHART_COLORS[color as keyof typeof CHART_COLORS]).toBe('string');
      });
    });

    it('should have valid hex color values', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      
      Object.values(CHART_COLORS).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });
}); 