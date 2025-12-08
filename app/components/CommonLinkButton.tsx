'use client';

export default function CommonLinkButton({
  text,
  onclick,
}: {
  text: string;
  onclick?: () => void;
}) {
  return (
    <button
      onClick={onclick}
      className="group relative w-fit py-3 flex gap-2 items-center outline-none border-b-2 border-(--border-color-default) cursor-pointer"
    >
      <div className="relative flex items-start">
        {/* Button Text in span */}
        <span className="text-xl-regular text-(--typography-color-secondary-100)">
          {text}
        </span>

        {/* arrow */}
        <span className="absolute text-base text-white transition-transform duration-300 ease-in-out material-symbols-outlined -right-5 -top-1 group-hover:translate-x-1 group-hover:-translate-y-1 group-active:translate-y-0">
          north_east
        </span>
      </div>

      {/* underline animation */}
      <span className="pointer-events-none absolute left-0 -bottom-0.5 h-0.5 w-full overflow-hidden">
        <span className="block w-full h-full transition-transform duration-300 ease-in-out origin-left scale-x-0 bg-white group-hover:scale-x-100" />
      </span>
    </button>
  );
}
