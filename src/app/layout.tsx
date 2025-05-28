import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NULL - Not a User List Logic",
  description: "NULL é um sistema moderno e flexível que, definitivamente, não é uma lista de contatos. Desenvolvido com tecnologia de ponta para atender a diversas necessidades além do óbvio.",
  keywords: [
    "NULL",
    "Not a User List Logic",
    "sistema de cadastro",
    "CRUD moderno",
    "Next.js",
    "aplicação web",
    "gerenciador de dados",
    "formulário dinâmico",
    "sistema flexível"
  ],
  authors: [{ name: "Vicente M", url: "https://vincmp.dev" }],
  creator: "Vicente M",
  generator: "Next.js",
  metadataBase: new URL("https://projectnull.vercel.app"),
  openGraph: {
    title: "NULL - Not a User List Logic",
    description: "NULL é um sistema que não é uma lista de contatos. Descubra como essa plataforma pode se adaptar ao seu fluxo de dados com flexibilidade e desempenho.",
    url: "https://projectnull.vercel.app",
    siteName: "NULL",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
