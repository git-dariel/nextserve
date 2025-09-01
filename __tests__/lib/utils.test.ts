import {
  generateSlug,
  formatDate,
  formatRelativeTime,
  truncateText,
  capitalize,
  generateRandomString,
  isValidEmail,
  getInitials,
  calculatePagination,
} from '@/lib/utils';

describe('Utils', () => {
  describe('generateSlug', () => {
    it('converts text to slug format', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('This is a Test!')).toBe('this-is-a-test');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('handles special characters', () => {
      expect(generateSlug('Test@#$%^&*()123')).toBe('test123');
      expect(generateSlug('café-résumé')).toBe('caf-rsum');
    });

    it('handles empty strings', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug('   ')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25T00:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/December 25, 2023/);
    });

    it('handles string dates', () => {
      const formatted = formatDate('2023-12-25');
      expect(formatted).toMatch(/December 25, 2023/);
    });
  });

  describe('formatRelativeTime', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-12-25T12:00:00.000Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('formats recent times correctly', () => {
      const now = new Date('2023-12-25T12:00:00.000Z');
      const oneMinuteAgo = new Date('2023-12-25T11:59:00.000Z');
      const oneHourAgo = new Date('2023-12-25T11:00:00.000Z');
      const oneDayAgo = new Date('2023-12-24T12:00:00.000Z');

      expect(formatRelativeTime(oneMinuteAgo)).toBe('1m ago');
      expect(formatRelativeTime(oneHourAgo)).toBe('1h ago');
      expect(formatRelativeTime(oneDayAgo)).toBe('1d ago');
    });

    it('returns just now for very recent times', () => {
      const now = new Date('2023-12-25T12:00:00.000Z');
      const thirtySecondsAgo = new Date('2023-12-25T11:59:30.000Z');
      
      expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now');
    });
  });

  describe('truncateText', () => {
    it('truncates text correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('Exactly ten', 11)).toBe('Exactly ten');
    });

    it('handles empty strings', () => {
      expect(truncateText('', 5)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('capitalizes text correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('tEST')).toBe('Test');
    });

    it('handles empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('generateRandomString', () => {
    it('generates string of correct length', () => {
      expect(generateRandomString(10)).toHaveLength(10);
      expect(generateRandomString(5)).toHaveLength(5);
    });

    it('generates different strings', () => {
      const str1 = generateRandomString(10);
      const str2 = generateRandomString(10);
      expect(str1).not.toBe(str2);
    });
  });

  describe('isValidEmail', () => {
    it('validates email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@invalid.com')).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('generates initials correctly', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith Johnson')).toBe('JS');
      expect(getInitials('SingleName')).toBe('SI');
    });

    it('handles empty strings', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('calculatePagination', () => {
    it('calculates pagination correctly', () => {
      const result = calculatePagination(2, 10, 25);
      
      expect(result).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
        offset: 10,
      });
    });

    it('handles first page', () => {
      const result = calculatePagination(1, 10, 25);
      
      expect(result.hasPrev).toBe(false);
      expect(result.hasNext).toBe(true);
      expect(result.offset).toBe(0);
    });

    it('handles last page', () => {
      const result = calculatePagination(3, 10, 25);
      
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(false);
    });
  });
});
