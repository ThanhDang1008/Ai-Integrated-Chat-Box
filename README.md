# Ai-Integrated-Chat-Box
Smart Chatbot using Gemini API, supports quick question answering. Client-Server design with ReactJS (frontend), NodeJS/ExpressJS (backend). Integrates NLP, JWT security, optimizes user experience. Supports learning and research.

## Installation

To get started with this project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/ThanhDang1008/Ai-Integrated-Chat-Box.git
```

```bash
cd 
```

```bash
npm install

## Usage
To configure a custom port, modify the vite.config.js file as follows:
```js
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,//custom port
  },
})
```
To start the development server, run:
```bash
npm run dev

# Features
- Fast development with Vite
- Modular and scalable React components
- Integration with Gemini API for fetching data
- Responsive design for various screen sizes

```plaintext
react-vite-gemini/
├── public/                 # Static assets
├── src/                    # Source files
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # React components
│   ├── constants/          # Application-wide constants
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components
│   ├── redux/              # Redux state management
│   ├── services/           # API service functions
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   ├── AppRouter.jsx       # Centralized routing configuration
│   └── styles/             # CSS and styling
├── .gitignore              # Git ignore file
├── index.html              # HTML template
├── package.json            # Project metadata and dependencies
├── README.md               # Project documentation
└── vite.config.js          # Vite configuration
```

## Contributing
We welcome contributions to improve this project. To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch 
```git
(git checkout -b feature/YourFeature)
```
3. Make your changes
4. Commit your changes 
```
(git commit -m 'Add some feature')
```
5. Push to the branch 
```
(git push origin feature/YourFeature)
```
6. Open a Pull Request

## License
MIT
**Free Software, Hell Yeah!**
This project was created by Thành Dạng``
