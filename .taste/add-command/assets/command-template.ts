// Template for adding a new command to datemath-cli
// Copy this template and customize for your command

// 1. Add utility function (export for testing)
export const yourCalculation = (date: Date): string => {
  // Your calculation logic here
  // Example: return date.toISOString();
  return 'result';
};

// 2. Add command definition
program
  .command('commandname <date>')
  .description('Description of what this command does (ISO format: YYYY-MM-DD)')
  .option('-v, --verbose', 'Show detailed breakdown')
  .option('-u, --unit <unit>', 'Specify unit (if applicable)', 'days')
  .action((date: string, options) => {
    try {
      // Parse and validate input
      const targetDate = parseDate(date);
      
      // Perform calculation
      const result = yourCalculation(targetDate);
      
      // Display result
      console.log(chalk.cyan(`${figures.info} Result:`));
      console.log(chalk.bold.green(result));
      
      // Optional verbose output
      if (options.verbose) {
        console.log(chalk.dim(`  = additional details`));
      }
      
      // Spacing
      console.log();
    } catch (error) {
      console.error(chalk.red(`${figures.cross} Error:`), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// 3. Add to interactive mode (src/calc-command.ts)
// In select options array:
// { value: 'commandname', label: 'Description for menu' }

// In if/else chain:
/*
if (operation === 'commandname') {
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
  const result = yourCalculation(targetDate);
  
  spinner.stop();
  
  console.log();
  console.log(chalk.cyan(`${figures.info} Result:`));
  console.log(chalk.bold.green(result));
  console.log();
  
  quickCommand = `datemath commandname ${date}`;
}
*/

// 4. Add tests (src/index.test.ts)
/*
describe('yourCalculation', () => {
  it('should calculate correctly', () => {
    const date = new Date('2025-01-01');
    const result = yourCalculation(date);
    expect(result).toBe('expected value');
  });
  
  it('should handle edge cases', () => {
    const date = new Date('2024-02-29'); // leap year
    const result = yourCalculation(date);
    expect(result).toBeDefined();
  });
  
  it('should throw on invalid input', () => {
    expect(() => yourCalculation(null as any)).toThrow();
  });
});
*/
