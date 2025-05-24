# AI Tools Directory

A modern web application showcasing and reviewing AI tools across various categories. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Browse AI tools by category
- Detailed tool pages with reviews and ratings
- User-submitted reviews and ratings
- Responsive design
- Dark/Light mode support
- Internationalization (i18n) support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (Database ORM)
- SQLite (Development)
- PostgreSQL (Production)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-tools-directory.git
cd ai-tools-directory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
