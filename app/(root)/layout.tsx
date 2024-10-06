import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/toaster";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            {/* Main content */}
            <Navbar />

            <div className="lg:ml-64  flex-grow p-4 ">

                {children}

              <Toaster/>
            </div>
        </div>


    );
}