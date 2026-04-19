"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ClientAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        toast.success("You are already signed in");
        router.replace("/dashboard"); // Middleware will automatically correct to /admin if the role is admin
    }, [router]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
           <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
    );
}
