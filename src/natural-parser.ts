export const parseNaturalDate = (input: string): Date => {
  const normalized = input.toLowerCase().trim();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (normalized === 'today') {
    return today;
  }

  if (normalized === 'yesterday') {
    const date = new Date(today);
    date.setDate(date.getDate() - 1);
    return date;
  }

  if (normalized === 'tomorrow') {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return date;
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = dayNames.indexOf(normalized);
  
  if (dayIndex !== -1) {
    const currentDay = today.getDay();
    let daysAgo = currentDay - dayIndex;
    
    if (daysAgo <= 0) {
      daysAgo += 7;
    }
    
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDateRegex.test(input)) {
    const date = new Date(input);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  throw new Error(`Unable to parse date: ${input}. Use ISO format (YYYY-MM-DD) or natural language (today, yesterday, tomorrow, Monday, Tuesday, etc.)`);
};
