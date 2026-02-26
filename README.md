# Resume Builder

A React-based resume builder application similar to FlowCV, with a fixed resume structure and PDF export functionality.

## Features

- **Live Preview**: Real-time preview of your resume as you type
- **Fixed Structure**: Pre-defined resume sections (Summary, 4 Experience entries, Technical Skills, Education)
- **PDF Export**: Download your resume as a PDF with consistent styling
- **Bullet Points**: Easy management of multiple bullet points per experience
- **Responsive Design**: Clean, professional layout with 40/60 split between editor and preview

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

This creates a production build in the `dist` folder.

### Preview Production Build

**Important:** Do NOT open `dist/index.html` directly in your browser. This will cause CORS errors because browsers block ES modules from the `file://` protocol.

Instead, use the preview server:

```bash
npm run preview
```

The app will be available at `http://localhost:4173`

Alternatively, you can use any local HTTP server:
- Python: `python -m http.server 8000` (in the `dist` folder)
- Node.js: `npx serve dist`
- VS Code: Use the "Live Server" extension

## Usage

1. Fill in the form fields in the left panel (Editor)
2. Watch the live preview update in the right panel
3. Add multiple bullet points for each experience entry
4. Click "Download PDF" to export your resume

## Project Structure

```
src/
  ├── components/
  │   ├── EditorPanel.jsx      # Left panel form editor
  │   ├── PreviewPanel.jsx     # Right panel preview container
  │   ├── ResumeDocument.jsx   # Formatted resume layout
  │   └── DownloadButton.jsx   # PDF download button
  ├── App.jsx                  # Main app component
  ├── main.jsx                 # React entry point
  └── index.css                # Tailwind CSS styles
```

## Technologies

- React 18
- Vite
- Tailwind CSS
- react-to-print (PDF export)

