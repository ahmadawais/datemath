i've been opening spreadsheets to calculate dates for years. how many days until this ships? when did we start? it's 2025 and i'm still context-switching to sheets for arithmetic.

so i built datemath-cli. not because date math is hard—it isn't. but because the friction is real. i'm in the terminal, i need to know "how many weeks since we launched?" and i don't want to leave.

`datemath since 2025-01-01` and i know. no windows, no tabs, no "let me just..."

added an interactive mode because sometimes i'm not sure what i need. `datemath calc` drops me into a prompt—pick the calculation, enter dates, done.

the verbose flag is my favorite. instead of "289 days" i get "289 days = 41 weeks = 9 months, 19 days" in one shot. because i know i'll wonder "how many weeks?" two seconds later.

best part: `npx datemath-cli today` works without installing. exists when i need it, disappears when i don't.

it's just date math. but it stays out of my way.

💜 github.com/ahmadawais/datemath-cli
