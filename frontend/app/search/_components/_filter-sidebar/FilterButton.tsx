export function FilterButton({
  onClick,
  active,
  text,
}: {
  onClick: () => void;
  active: boolean;
  text: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm w-fit rounded-full ${active ? "bg-maroon text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
    >
      {text}
    </button>
  );
}
