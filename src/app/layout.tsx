import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from './provider';
import Footer from '@/components/footer/page';
import Header from '@/components/header/page';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} w-[375px] flex flex-col mx-auto h-screen items-center`}>
        <QueryProvider>
          {/* <Header /> */}
          <main className='w-full flex-1 overflow-y-auto'>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
