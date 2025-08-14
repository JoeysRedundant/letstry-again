# Todo List App

A beautiful and functional todo list application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete individual todos
- ✅ Filter todos (All, Active, Completed)
- ✅ Clear all completed todos
- ✅ Persistent storage using localStorage
- ✅ Responsive design
- ✅ Modern UI with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React useState and useEffect

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Todos
- Type your todo in the input field
- Press Enter or click the "Add" button

### Managing Todos
- Click the circle button to toggle completion status
- Click the trash icon to delete a todo
- Use the filter tabs to view different categories

### Clearing Completed
- Click "Clear completed" to remove all completed todos

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main todo list component
│   └── globals.css     # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Persistence

Todos are automatically saved to localStorage and will persist between browser sessions.

## Contributing

Feel free to submit issues and enhancement requests!
