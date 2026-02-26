# AI Interview Practice App 

A modern, interactive technical interview practice application built with React and TypeScript. Practice your interview skills with an AI interviewer in a realistic chat-based environment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component Documentation](#component-documentation)
- [Customization](#customization)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

##  Features

- **Real-time Chat Interface**: Smooth, interactive conversation flow with the AI interviewer
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface with Tailwind CSS styling
- **Type-Safe**: Built with TypeScript for robust type checking and better developer experience
- **Animated Interactions**: Smooth transitions and loading states for enhanced user experience
- **Accessible**: ARIA labels and keyboard navigation support

## Demo

### Interview Flow
1. Click "Start Interview" to begin
2. AI asks an opening question
3. Type your response in the chat input
4. Receive follow-up questions based on your answers

## Tech Stack

- **Frontend Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Build Tool**: Vite
- **Nodejs**: 20.x for backend

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/ai-interview-practice.git
   cd ai-interview-practice
```

2. **Install dependencies**
```bash
   npm install
   # or
   yarn install
```

3. **Start the development server**
```bash
   npm run dev
   # or
   yarn dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production
```bash
npm run build
# or
yarn build
```

The optimized build will be in the `dist` folder.

### Preview Production Build
npm run preview
# or
yarn preview

**State:**
- `messages`: Array of chat messages (user and AI)
- `nextId`: Counter for generating unique message IDs
- `interviewStarted`: Boolean flag to track interview status

**Key Functions:**
- `handleSendMessage(text: string)`: Processes user input and triggers AI response
- `startInterview()`: Initializes the interview session

### Home Component (`page/Home.tsx`)

The welcome screen that greets users and provides the start button.


- Error handling with fallback name
- Animated avatar with user's first initial`

**Features:**
- Text input with submit button
- Enter key to send (Shift+Enter for new line)
- Input validation (prevents empty messages)
- Auto-focus on mount


### Color Scheme

The app uses custom Tailwind colors defined in `tailwind.config.js`:
```javascript
colors: {
  bg: '#0f172a',        // Background color
  surface: '#1e293b',   // Surface/card color
  primary: '#3b82f6',   // Primary accent color
  text: '#f1f5f9',      // Text color
}
```

To customize colors, update these values in your Tailwind configuration.

### Interview Questions

### Styling

All components use Tailwind CSS utility classes. To modify styles:

1. **Global styles**: Edit `src/index.css`
2. **Component styles**: Update className props in individual components
3. **Theme**: Modify `tailwind.config.js`

### Responsive Breakpoints

The app uses Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Sidebar margins adjust based on screen size:
```css
sm:ml-72    /* Small screens and up */
md:ml-80    /* Medium screens and up */
lg:ml-[20%] /* Large screens and up */
```

## 🔮 Future Enhancements

### Planned Features

- [ ] **Real AI Integration**: Connect to Claude, OpenAI, or other AI APIs
- [ ] **Interview Types**: Multiple interview categories (behavioral, system design, coding)
- [ ] **Session History**: Save and review past interview sessions
- [ ] **Performance Analytics**: Track improvement over time
- [ ] **Custom Questions**: Allow users to add their own question banks
- [ ] **Voice Input/Output**: Speech-to-text and text-to-speech capabilities
- [ ] **Feedback System**: AI-generated feedback on responses
- [ ] **Timer**: Interview session timer and time management
- [ ] **Export Transcripts**: Download interview conversations as PDF/TXT
- [ ] **Multi-language Support**: Interview in different languages

### Technical Improvements

- [ ] Add unit tests (Jest, React Testing Library)
- [ ] Implement end-to-end tests (Playwright, Cypress)
- [ ] Add state management (Zustand, Redux)
- [ ] Implement local storage for session persistence
- [ ] Add error boundary components
- [ ] Optimize bundle size and performance
- [ ] Add PWA support for offline functionality
- [ ] Implement real-time typing indicators
- [ ] Add markdown support for code snippets in responses

## 🐛 Bug Reports

If you discover a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Browser and OS information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React](https://react.dev/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

**Made with ❤️ by Emediong Jonah **

*Happy interviewing! *