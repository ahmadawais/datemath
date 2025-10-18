import chalk from 'chalk';
import * as p from '@clack/prompts';
import ora from 'ora';
import { parseDate, formatHumanDate, daysBetween, formatDuration } from './index';

export async function calcCommand() {
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

  let quickCommand = '';
  
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
      
      quickCommand = `datemath ${operation} ${date}`;
      
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
      
      quickCommand = `datemath between ${date1} ${date2}`;
      
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
      
      quickCommand = `datemath ${operation} ${date} ${amount} ${unit}`;
    }
    
    p.outro(chalk.green('✓ Calculation complete!'));
    
    if (quickCommand) {
      console.log();
      console.log(chalk.dim('💡 Tip: Next time, run this directly:'));
      console.log(chalk.cyan(`   ${quickCommand}`));
      console.log();
    }
    
  } catch (error) {
    p.cancel(chalk.red('Error: ') + (error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
