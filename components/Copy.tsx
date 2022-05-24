import { DuplicateIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react/headless";
import useCopyClipboard from "react-use-clipboard";

export default function Copy({ text }: { text: string }) {
  const [isCopied, setCopied] = useCopyClipboard(text, {
    successDuration: 3000,
  });
  return (
    <Tippy
      hideOnClick={false}
      render={() => (
        <div className="bg-gray-500 text-white px-2 py-0.5 rounded-xl">{isCopied ? "Skopiowano" : "Skopiuj"}</div>
      )}
    >
      <DuplicateIcon
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setCopied();
        }}
        className="w-4 h-4 text-blue-500 hover:brightness-90 cursor-pointer"
      />
    </Tippy>
  );
}
