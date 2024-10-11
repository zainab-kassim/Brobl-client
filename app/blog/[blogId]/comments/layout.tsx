import Navbar from "@/components/shared/Navbar";
import SearchInput from "@/components/shared/searchInput";
import { Toaster } from "@/components/ui/toaster";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <section className='px-4 pt-4 '>
                <SearchInput />
            </section>

            <div className="flex h-screen">

                {/* Main content */}
                <Navbar />

                <div className="lg:ml-64  flex-grow p-2 ">

                    {children}

                    <Toaster />
                </div>
            </div>

        </>
    );
}