// app/layout.jsx

export const metadata = {
  title: "Tenant Survey Portal",
  description: "Upload and view tenant surveys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
