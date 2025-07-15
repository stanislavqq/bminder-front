export function formatBirthDate(birthDate: string, hasYear: boolean): string {
  if (!hasYear) {
    // Format: --MM-DD
    const [month, day] = birthDate.slice(2).split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  }
  
  // Format: YYYY-MM-DD
  const date = new Date(birthDate);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateAge(birthDate: string, hasYear: boolean): string | null {
  if (!hasYear) {
    return null;
  }
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age === 1) {
    return "1 год";
  } else if (age % 10 === 1 && age % 100 !== 11) {
    return `${age} год`;
  } else if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) {
    return `${age} года`;
  } else {
    return `${age} лет`;
  }
}

export function calculateDaysUntilBirthday(birthDate: string, hasYear: boolean): number {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  let birthMonth: number;
  let birthDay: number;
  
  if (!hasYear) {
    // Format: --MM-DD
    const [month, day] = birthDate.slice(2).split('-');
    birthMonth = parseInt(month) - 1; // Month is 0-indexed
    birthDay = parseInt(day);
  } else {
    // Format: YYYY-MM-DD
    const birth = new Date(birthDate);
    birthMonth = birth.getMonth();
    birthDay = birth.getDate();
  }
  
  // Create birthday date for current year
  let nextBirthday = new Date(currentYear, birthMonth, birthDay);
  
  // If birthday has passed this year, set it for next year
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
  }
  
  // Calculate days until birthday
  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}
