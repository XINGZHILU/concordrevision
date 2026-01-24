# Concordpedia

<div align="center">

**A comprehensive educational resource platform for students and teachers**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 📚 Overview

Concordpedia is a modern educational platform designed to facilitate resource sharing between students and teachers. The platform provides comprehensive revision materials, past papers, university guidance (UCAS), and academic olympiad resources for GCSE/IGCSE and A-Level students.

### ✨ Key Features

- **📝 Revision Notes**: Community-contributed revision materials across multiple subjects and exam boards
- **📄 Past Papers**: Organized collection of past examination papers with progress tracking
- **🎓 UCAS Resources**: University course information, admission statistics, and application guidance
- **🏆 Olympiad Resources**: Materials and information for academic competitions
- **👨‍🏫 Teacher Portal**: Dedicated interface for teachers to manage and approve resources
- **🔐 Admin Dashboard**: Comprehensive administration tools for content moderation
- **🌓 Dark Mode**: Beautiful rendering in both light and dark themes
- **📱 Responsive Design**: Optimized for both mobile and desktop devices

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** database
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd concordrevision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
   CLERK_SECRET_KEY="..."
   CLERK_WEBHOOK_SECRET="..."
   
   # Supabase (for file storage)
   NEXT_PUBLIC_SUPABASE_URL="..."
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="..."
   
   # MongoDB (for embeddings/chatbot)
   MONGODB_URI="..."
   
   # Optional: Edge Config
   EDGE_CONFIG="..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production-ready application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run embed` | Generate embeddings for chatbot/search |
| `npm run vercel-build` | Build command for Vercel deployment |

## 🏗️ Project Structure

```
concordrevision/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin dashboard routes
│   │   ├── (main)/            # Main application routes
│   │   ├── (teachers)/        # Teacher portal routes
│   │   ├── (terms)/           # Terms & privacy pages
│   │   └── api/               # API routes
│   └── lib/
│       ├── components/        # Reusable UI components
│       │   └── ui/           # shadcn/ui components
│       ├── customui/         # Custom feature components
│       ├── utils/            # Utility functions
│       ├── markdown/         # MDX content files
│       └── types/            # TypeScript type definitions
├── pages/
│   └── api/                   # Legacy API routes
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                    # Static assets
└── _assets/                   # Documentation & resources
    └── fcc_docs/             # Economics curriculum documents
```

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.3** - React framework with App Router
- **React 19.0** - UI library
- **TypeScript 5.8** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Chakra UI** - Component library
- **shadcn/ui** - Re-usable components
- **Lucide React** - Icon library

### Database & ORM
- **Prisma 6.5** - Next-generation ORM
- **PostgreSQL** - Relational database
- **MongoDB** - Document database (for embeddings)

### Authentication & Authorization
- **Clerk** - User authentication and management
- **Supabase Auth** - Additional auth features

### File Storage
- **Vercel Blob** - File storage
- **Supabase Storage** - Media storage

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod 4.0** - Schema validation

### Additional Libraries
- **react-pdf** - PDF rendering
- **react-md-editor** - Markdown editing
- **LangChain** - AI/ML integrations
- **date-fns** - Date utilities

## 👥 User Roles

### Students
- Browse and download revision materials
- Track past paper progress
- Access UCAS course information
- Upload resources (with permission)
- Subscribe to subject updates

### Teachers
- Upload and manage educational resources
- Create and moderate content
- Access enhanced course materials
- Manage olympiad resources

### Administrators
- Approve/reject uploaded resources
- Manage user permissions
- Moderate UCAS posts
- Access comprehensive analytics
- Manage subjects and courses

## 🔒 Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User** - User accounts with roles (student/teacher/admin)
- **Subject** - Academic subjects with exam boards and year groups
- **Note** - Revision notes and study materials
- **PastPaper** - Past examination papers
- **UCASPost** - University course information
- **Olympiad** - Academic competition resources
- **University** - Higher education institutions
- **Course** - University courses with admission statistics

*Note: Do not modify the database schema or create migrations without approval.*

## 🎨 Design Principles

### UI/UX Guidelines
- **Consistent Theming**: All components render beautifully in both light and dark modes
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Accessibility**: ARIA-compliant components using Radix UI primitives
- **Modern Aesthetics**: Clean, gradient-enhanced interfaces with smooth animations

### Code Guidelines
- **TypeScript First**: Strict type checking for reliability
- **Component Reusability**: Copy and adapt similar components instead of creating new ones
- **Absolute Imports**: Always use `@/` imports instead of relative paths
- **Server Components**: Use React Server Components by default
- **Form Handling**: MDEditor for markdown, React Hook Form + Zod for validation
- **Authentication**: Always use Clerk for user information (not Supabase)

## 📝 Contributing

When contributing to Concordpedia:

1. **Maintain consistency**: Use existing components as templates
2. **Follow the style guide**: Adhere to workspace rules in the codebase
3. **Test thoroughly**: Ensure changes work on both mobile and desktop
4. **Document changes**: Write clear, concise comments
5. **Respect the database**: Do not alter schema or migrations

## 🔐 Security

- Environment variables must never be committed
- Authentication handled by Clerk
- Admin actions require proper role verification
- File uploads are validated and scanned
- User data is encrypted at rest

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with ❤️ for the educational community
- Powered by modern web technologies
- Special thanks to all contributors

## 📞 Support

For questions, issues, or suggestions, please contact the development team or open an issue in the repository.

---

<div align="center">

**Made with Next.js, TypeScript, and Tailwind CSS**

*Empowering education through technology*

</div>
