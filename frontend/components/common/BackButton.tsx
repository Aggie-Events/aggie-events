import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ text = "Back" }: { text?: string }) {
    const router = useRouter();

    const handleBack = () => {
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
          router.back();
        } else {
          router.push('/');
        }
      };

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-maroon mb-6 group transition-colors"
          >
            <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
            <span>{text}</span>
        </button>
    );
}
