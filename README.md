# Hvem vil være millionær? (Who Wants to Be a Millionaire?)

A Danish version of the classic game show "Who Wants to Be a Millionaire?" built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 15 progressive difficulty levels
- Three lifelines:
  - 50/50: Removes two incorrect answers
  - Phone a Friend: Simulates calling a friend for help
  - Ask the Audience: Shows audience poll results
- Checkpoint system at levels 5 and 10
- Responsive design for mobile, tablet, and desktop
- Progressive Web App (PWA) support
- Danish language interface

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Font:** Montserrat (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SebastianFoder/who-wants-to-be-a-millionare.git
cd millionaire-game
```

2. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

3. Run the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Game Rules

1. Players start at level 1 and progress through 15 questions
2. Each question has four possible answers
3. Players can use three lifelines:
   - 50/50
   - Phone a Friend
   - Ask the Audience
4. Checkpoints at levels 5 and 10 secure winnings
5. Wrong answers end the game
6. Players can quit at any time with current winnings

## Prize Levels

1. 1,000 kr
2. 2,000 kr
3. 3,000 kr
4. 4,000 kr
5. 5.000 kr (Checkpoint)
6. 8.000 kr
7. 12.000 kr
8. 20.000 kr
9. 32.000 kr
10. 50.000 kr (Checkpoint)
11. 75.000 kr
12. 125.000 kr
13. 250.000 kr
14. 500.000 kr
15. 1 MILLION kr

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
