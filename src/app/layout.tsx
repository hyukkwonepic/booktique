import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from './provider';

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
        className={` ${inter.className} sm:w-full md:w-[375px]  flex flex-col mx-auto h-screen items-center`}>
        <QueryProvider>
          {/* <Header /> */}
          <main className='w-full flex-1'>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
