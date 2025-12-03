"use client"

export default function commonLinkButton({
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
        <h6 className="text-(--typography-color-secondary-100)">{text}</h6>

        {/* arrow */}
        <span
          className="
            material-symbols-outlined text-white text-base
            absolute -right-5 -top-1
            transition-transform duration-300 ease-in-out
            group-hover:translate-x-1 group-hover:-translate-y-1
            group-active:translate-y-0
          "
        >
          north_east
        </span>
      </div>

      {/* underline animation */}
      <span className="pointer-events-none absolute left-0 -bottom-[2px] h-[2px] w-full overflow-hidden">
        <span
          className="
            block h-full w-full bg-white
            origin-left scale-x-0
            transition-transform duration-300 ease-in-out
            group-hover:scale-x-100
          "
        />
      </span>
    </button>
  );
}
