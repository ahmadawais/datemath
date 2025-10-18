import { Command } from 'commander';
import chalk from 'chalk';
import gradient from 'gradient-string';
import * as p from '@clack/prompts';
import ora from 'ora';

const program = new Command();

// Welcome screen with gradient ASCII art
const welcome = () => {
  const asciiArt = `
██████╗  █████╗ ████████╗███████╗    ███╗   ███╗ █████╗ ████████╗██╗  ██╗
██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ████╗ ████║██╔══██╗╚══██╔══╝██║  ██║
██║  ██║███████║   ██║   █████╗      ██╔████╔██║███████║   ██║   ███████║
██║  ██║██╔══██║   ██║   ██╔══╝      ██║╚██╔╝██║██╔══██║   ██║   ██╔══██║
██████╔╝██║  ██║   ██║   ███████╗    ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
  `;

  console.log(gradient.pastel.multiline(asciiArt));
  console.log(chalk.dim('─'.repeat(70)));
  console.log(
    chalk.bold.cyan('datemath-cli') + chalk.dim(' v1.0.0') + 
    chalk.dim(' - Date calculations in natural language')
  );
  console.log(chalk.dim('─'.repeat(70)));
  console.log();
};

// Date parsing and validation
export const parseDate = (dateStr: string): Date => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return date;
};

// Format date in human-readable format
export const formatHumanDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

// Calculate difference in days
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate difference in weeks
export const weeksBetween = (date1: Date, date2: Date): number => {
  const days = daysBetween(date1, date2);
  return Math.floor(days / 7);
};

// Calculate difference in months (approximate)
export const monthsBetween = (date1: Date, date2: Date): number => {
  const years = date2.getFullYear() - date1.getFullYear();
  const months = date2.getMonth() - date1.getMonth();
  return years * 12 + months;
};

// Calculate difference in years
export const yearsBetween = (date1: Date, date2: Date): number => {
  return date2.getFullYear() - date1.getFullYear();
};

// Format duration in human language
export const formatDuration = (days: number): string => {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  const weeks = Math.floor(days / 7);

  const parts: string[] = [];
  
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (remainingDays > 0 && years === 0) parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
  if (parts.length === 0 && weeks > 0) parts.push(`${weeks} week${weeks !== 1 ? 's' : ''}`);
  if (parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

  return parts.join(', ');
};

// Commands
program
  .name('datemath')
  .description('A beautiful CLI for date calculations in natural language')
  .version('1.0.0')
  .hook('preAction', () => {
    welcome();
  });

// Today command - shows current date
program
  .command('today')
  .description('Show today\'s date in human format')
  .action(() => {
    const today = new Date();
    console.log(chalk.cyan('📅 Today is:'));
    console.log(chalk.bold.white(formatHumanDate(today)));
    console.log(chalk.dim(`ISO format: ${today.toISOString().split('T')[0]}`));
    console.log();
  });

// Since command - days since a date
program
  .command('since <date>')
  .description('Calculate days since a date (ISO format: YYYY-MM-DD)')
  .option('-v, --verbose', 'Show detailed breakdown')
  .action((date: string, options) => {
    try {
      const targetDate = parseDate(date);
      const today = new Date();
      const days = daysBetween(targetDate, today);
      const weeks = weeksBetween(targetDate, today);
      
      console.log(chalk.cyan(`📊 Time since ${formatHumanDate(targetDate)}:`));
      console.log(chalk.bold.green(`${days} days`));
      
      if (options.verbose) {
        console.log(chalk.dim(`  = ${weeks} weeks`));
        console.log(chalk.dim(`  = ${formatDuration(days)}`));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red('✖ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// To/Until command - days until a date
program
  .command('to <date>')
  .alias('until')
  .description('Calculate days until a date (ISO format: YYYY-MM-DD)')
  .option('-v, --verbose', 'Show detailed breakdown')
  .action((date: string, options) => {
    try {
      const targetDate = parseDate(date);
      const today = new Date();
      const days = daysBetween(today, targetDate);
      const weeks = weeksBetween(today, targetDate);
      
      const isPast = targetDate < today;
      
      if (isPast) {
        console.log(chalk.yellow(`⚠️  ${formatHumanDate(targetDate)} is in the past`));
      }
      
      console.log(chalk.cyan(`📊 Time ${isPast ? 'since' : 'until'} ${formatHumanDate(targetDate)}:`));
      console.log(chalk.bold.green(`${days} days`));
      
      if (options.verbose) {
        console.log(chalk.dim(`  = ${weeks} weeks`));
        console.log(chalk.dim(`  = ${formatDuration(days)}`));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red('✖ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Between command - calculate difference between two dates
program
  .command('between <date1> <date2>')
  .description('Calculate time between two dates (ISO format: YYYY-MM-DD)')
  .option('-u, --unit <unit>', 'Unit: days, weeks, months, years', 'days')
  .option('-v, --verbose', 'Show all units')
  .action((date1: string, date2: string, options) => {
    try {
      const firstDate = parseDate(date1);
      const secondDate = parseDate(date2);
      
      const [earlier, later] = firstDate < secondDate 
        ? [firstDate, secondDate] 
        : [secondDate, firstDate];
      
      console.log(chalk.cyan(`📊 Time between ${formatHumanDate(earlier)} and ${formatHumanDate(later)}:`));
      
      if (options.verbose) {
        const days = daysBetween(earlier, later);
        const weeks = weeksBetween(earlier, later);
        const months = monthsBetween(earlier, later);
        const years = yearsBetween(earlier, later);
        
        console.log(chalk.bold.green(`  ${days} days`));
        console.log(chalk.dim(`  ${weeks} weeks`));
        console.log(chalk.dim(`  ${months} months`));
        console.log(chalk.dim(`  ${years} years`));
        console.log(chalk.dim(`  ${formatDuration(days)}`));
      } else {
        const unit = options.unit.toLowerCase();
        let result: number;
        
        switch (unit) {
          case 'days':
            result = daysBetween(earlier, later);
            break;
          case 'weeks':
            result = weeksBetween(earlier, later);
            break;
          case 'months':
            result = monthsBetween(earlier, later);
            break;
          case 'years':
            result = yearsBetween(earlier, later);
            break;
          default:
            throw new Error(`Unknown unit: ${unit}`);
        }
        
        console.log(chalk.bold.green(`${result} ${unit}`));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red('✖ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Add command - add days/weeks/months to a date
program
  .command('add <date> <amount> <unit>')
  .description('Add time to a date (e.g., add 2025-01-01 30 days)')
  .action((date: string, amount: string, unit: string) => {
    try {
      const baseDate = parseDate(date);
      const numAmount = parseInt(amount);
      
      if (isNaN(numAmount)) {
        throw new Error(`Invalid amount: ${amount}`);
      }
      
      const resultDate = new Date(baseDate);
      
      switch (unit.toLowerCase()) {
        case 'day':
        case 'days':
          resultDate.setDate(resultDate.getDate() + numAmount);
          break;
        case 'week':
        case 'weeks':
          resultDate.setDate(resultDate.getDate() + (numAmount * 7));
          break;
        case 'month':
        case 'months':
          resultDate.setMonth(resultDate.getMonth() + numAmount);
          break;
        case 'year':
        case 'years':
          resultDate.setFullYear(resultDate.getFullYear() + numAmount);
          break;
        default:
          throw new Error(`Unknown unit: ${unit}`);
      }
      
      console.log(chalk.cyan(`📊 ${formatHumanDate(baseDate)} + ${numAmount} ${unit}:`));
      console.log(chalk.bold.green(formatHumanDate(resultDate)));
      console.log(chalk.dim(`ISO format: ${resultDate.toISOString().split('T')[0]}`));
      console.log();
    } catch (error) {
      console.error(chalk.red('✖ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Subtract command
program
  .command('subtract <date> <amount> <unit>')
  .alias('sub')
  .description('Subtract time from a date (e.g., subtract 2025-01-01 30 days)')
  .action((date: string, amount: string, unit: string) => {
    try {
      const baseDate = parseDate(date);
      const numAmount = parseInt(amount);
      
      if (isNaN(numAmount)) {
        throw new Error(`Invalid amount: ${amount}`);
      }
      
      const resultDate = new Date(baseDate);
      
      switch (unit.toLowerCase()) {
        case 'day':
        case 'days':
          resultDate.setDate(resultDate.getDate() - numAmount);
          break;
        case 'week':
        case 'weeks':
          resultDate.setDate(resultDate.getDate() - (numAmount * 7));
          break;
        case 'month':
        case 'months':
          resultDate.setMonth(resultDate.getMonth() - numAmount);
          break;
        case 'year':
        case 'years':
          resultDate.setFullYear(resultDate.getFullYear() - numAmount);
          break;
        default:
          throw new Error(`Unknown unit: ${unit}`);
      }
      
      console.log(chalk.cyan(`📊 ${formatHumanDate(baseDate)} - ${numAmount} ${unit}:`));
      console.log(chalk.bold.green(formatHumanDate(resultDate)));
      console.log(chalk.dim(`ISO format: ${resultDate.toISOString().split('T')[0]}`));
      console.log();
    } catch (error) {
      console.error(chalk.red('✖ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Interactive mode
program
  .command('calc')
  .description('Interactive date calculator')
  .action(async () => {
    p.intro(chalk.inverse(' Date Calculator '));
    
    const operation = await p.select({
      message: 'What would you like to calculate?',
      options: [
        { value: 'since', label: 'Days since a date' },
        { value: 'until', label: 'Days until a date' },
        { value: 'between', label: 'Time between two dates' },
        { value: 'add', label: 'Add time to a date' },
        { value: 'subtract', label: 'Subtract time from a date' },
      ],
    });
    
    if (p.isCancel(operation)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }
    
    try {
      if (operation === 'since' || operation === 'until') {
        const date = await p.text({
          message: 'Enter date (YYYY-MM-DD):',
          placeholder: '2025-10-17',
          validate: (value) => {
            try {
              parseDate(value);
            } catch {
              return 'Please enter a valid date in YYYY-MM-DD format';
            }
          },
        });
        
        if (p.isCancel(date)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        
        const spinner = ora('Calculating...').start();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const targetDate = parseDate(date);
        const today = new Date();
        const days = daysBetween(today, targetDate);
        
        spinner.stop();
        
        console.log();
        console.log(chalk.cyan(`📊 Result:`));
        console.log(chalk.bold.green(`${days} days ${operation === 'since' ? 'since' : 'until'} ${formatHumanDate(targetDate)}`));
        console.log(chalk.dim(`  = ${formatDuration(days)}`));
        
      } else if (operation === 'between') {
        const date1 = await p.text({
          message: 'Enter first date (YYYY-MM-DD):',
          placeholder: '2025-01-01',
          validate: (value) => {
            try {
              parseDate(value);
            } catch {
              return 'Please enter a valid date';
            }
          },
        });
        
        if (p.isCancel(date1)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        
        const date2 = await p.text({
          message: 'Enter second date (YYYY-MM-DD):',
          placeholder: '2025-10-17',
          validate: (value) => {
            try {
              parseDate(value);
            } catch {
              return 'Please enter a valid date';
            }
          },
        });
        
        if (p.isCancel(date2)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        
        const spinner = ora('Calculating...').start();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const firstDate = parseDate(date1);
        const secondDate = parseDate(date2);
        const days = daysBetween(firstDate, secondDate);
        
        spinner.stop();
        
        console.log();
        console.log(chalk.cyan(`📊 Result:`));
        console.log(chalk.bold.green(`${days} days between dates`));
        console.log(chalk.dim(`  = ${formatDuration(days)}`));
        
      } else if (operation === 'add' || operation === 'subtract') {
        const date = await p.text({
          message: 'Enter base date (YYYY-MM-DD):',
          placeholder: '2025-10-17',
          validate: (value) => {
            try {
              parseDate(value);
            } catch {
              return 'Please enter a valid date';
            }
          },
        });
        
        if (p.isCancel(date)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        
        const amount = await p.text({
          message: 'Enter amount:',
          placeholder: '30',
          validate: (value) => {
            if (isNaN(parseInt(value))) return 'Please enter a number';
          },
        });
        
        if (p.isCancel(amount)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        
        const unit = await p.select({
          message: 'Select unit:',
          options: [
            { value: 'days', label: 'Days' },
            { value: 'weeks', label: 'Weeks' },
            { value: 'months', label: 'Months' },
            { value: 'years', label: 'Years' },
          ],
        });
        
        if (p.isCancel(unit)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        
        const spinner = ora('Calculating...').start();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const baseDate = parseDate(date);
        const numAmount = parseInt(amount);
        const resultDate = new Date(baseDate);
        
        const multiplier = operation === 'add' ? 1 : -1;
        
        switch (unit) {
          case 'days':
            resultDate.setDate(resultDate.getDate() + (numAmount * multiplier));
            break;
          case 'weeks':
            resultDate.setDate(resultDate.getDate() + (numAmount * 7 * multiplier));
            break;
          case 'months':
            resultDate.setMonth(resultDate.getMonth() + (numAmount * multiplier));
            break;
          case 'years':
            resultDate.setFullYear(resultDate.getFullYear() + (numAmount * multiplier));
            break;
        }
        
        spinner.stop();
        
        console.log();
        console.log(chalk.cyan(`📊 Result:`));
        console.log(chalk.bold.green(formatHumanDate(resultDate)));
        console.log(chalk.dim(`ISO format: ${resultDate.toISOString().split('T')[0]}`));
      }
      
      p.outro(chalk.green('✓ Calculation complete!'));
      
    } catch (error) {
      p.cancel(chalk.red('Error: ') + (error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  });

// Parse arguments only if running directly (not in tests)
if (process.env.NODE_ENV !== 'test') {
  program.parse();
}
