import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="he">
      <body>{children}</body>
    </html>
  );
}
