# Component Architecture

## 📁 Project Structure

```
frontend/
├── app/
│   ├── globals.css          # ✨ Enhanced with Inter font & design tokens
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                  # 🆕 Reusable UI Component Library
│   │   ├── Button.tsx       # Variant-based button system
│   │   ├── Card.tsx         # Modular card components
│   │   ├── Badge.tsx        # Status badges
│   │   ├── Input.tsx        # Enhanced input with icons
│   │   ├── EmptyState.tsx   # Consistent empty states
│   │   └── index.ts         # Barrel exports
│   │
│   ├── ChatInterface.tsx    # ✨ Enhanced chat UI
│   ├── KanbanBoard.tsx      # ✨ Improved kanban
│   ├── TaskCard.tsx         # ✨ Better task cards
│   └── MainDashboard.tsx    # ✨ Responsive dashboard
│
├── lib/
│   └── utils.ts             # 🆕 Utility functions (cn)
│
├── REDESIGN.md              # 🆕 Full documentation
└── package.json
```

## 🧩 Component Hierarchy

```
MainDashboard
├── Sidebar (Mobile Responsive)
│   ├── Logo
│   ├── Navigation
│   │   ├── Button (Kanban Board)
│   │   ├── Button (AI Assistant)
│   │   └── Button (Calendar)
│   └── User Profile
│
├── Header
│   ├── Menu Button (Mobile)
│   ├── Input (Search)
│   └── Button (New Task)
│
└── Main Content Area
    ├── KanbanBoard (Tab: Board)
    │   └── Column × 3
    │       ├── Column Header
    │       │   ├── Icon
    │       │   ├── Title
    │       │   └── Badge (Count)
    │       └── TaskCard × N
    │           ├── Badge (Priority)
    │           ├── Title
    │           ├── Description
    │           └── Actions
    │               ├── Button (Back)
    │               └── Button (Next/Complete)
    │
    ├── ChatInterface (Tab: Chat)
    │   ├── EmptyState (No messages)
    │   │   ├── Icon
    │   │   ├── Title
    │   │   ├── Description
    │   │   └── Suggested Prompts × 4
    │   │
    │   ├── Messages
    │   │   └── Message × N
    │   │       ├── Avatar
    │   │       ├── Content (Markdown)
    │   │       └── Badge × N (Tool calls)
    │   │
    │   └── Input Area
    │       ├── Input
    │       └── Button (Send)
    │
    └── EmptyState (Tab: Calendar)
        ├── Icon
        ├── Title
        └── Description
```

## 🎨 Component Props API

### Button
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

### Badge
```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
}
```

### Input
```tsx
interface InputProps extends HTMLInputProps {
  icon?: ReactNode;
  error?: string;
}
```

### EmptyState
```tsx
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}
```

### Card
```tsx
interface CardProps {
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
}
```

## 🎯 State Management

### MainDashboard State
```tsx
{
  tasks: Task[];              // Fetched from API
  activeTab: 'board' | 'chat'; // Current view
  userId: string;             // User identifier
  isLoading: boolean;         // Initial load state
  isSidebarOpen: boolean;     // Mobile sidebar state
}
```

### ChatInterface State
```tsx
{
  messages: Message[];        // Chat history
  input: string;              // Current input
  isLoading: boolean;         // Waiting for response
  error: string | null;       // Error message
  conversationId: number | null; // Session ID
}
```

### TaskCard Props
```tsx
{
  task: {
    id: number;
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    due_date?: string;
  };
  onUpdateStatus: (id: number, status: string) => void;
}
```

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call (fetch)
    ↓
Update State
    ↓
Re-render UI
    ↓
Framer Motion Animations
```

## 🎨 Design Tokens

### Colors
```css
/* Background */
--background: #0a0a0c
--background-elevated: #111115

/* Foreground */
--foreground: #ffffff
--foreground-muted: #a1a1aa

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.05)
--border-default: rgba(255, 255, 255, 0.1)
--border-strong: rgba(255, 255, 255, 0.2)

/* Surfaces */
--surface-overlay: rgba(255, 255, 255, 0.02)
--surface-hover: rgba(255, 255, 255, 0.05)

/* Brand */
--brand-primary: #6366f1
--brand-primary-hover: #818cf8
```

### Spacing Scale
```
4px  → gap-1, p-1
8px  → gap-2, p-2
12px → gap-3, p-3
16px → gap-4, p-4
24px → gap-6, p-6
32px → gap-8, p-8
48px → gap-12, p-12
```

### Border Radius
```
8px  → rounded-lg
12px → rounded-xl
16px → rounded-2xl
24px → rounded-3xl
```

## 🚀 Performance Optimizations

1. **Lazy Loading**: Ready for React.lazy code splitting
2. **Memoization**: Components use proper React keys
3. **Debouncing**: 5-second polling interval
4. **Animations**: GPU-accelerated with Framer Motion
5. **Bundle Size**: Tree-shaking with ES modules

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default → < 640px

/* Tablet */
sm: 640px

/* Desktop */
md: 768px
lg: 1024px
xl: 1280px
```

## ♿ Accessibility Features

- ✅ Semantic HTML (`<nav>`, `<main>`, `<header>`)
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus visible on all inputs/buttons
- ✅ Color contrast WCAG AA compliant
- ✅ Screen reader friendly

## 🎬 Animation Patterns

### Page Transitions
```tsx
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.2 }}
```

### Hover Effects
```tsx
whileHover={{ y: -2, scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Loading States
```tsx
<Loader2 className="animate-spin" />
```

---

**Component Architecture Complete** 🎉
