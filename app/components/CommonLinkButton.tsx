export default async function commonLinkButton({text,onclick}: {text: string, onclick?: () => void}) {

  return (
      <button onClick={onclick} className="border-b-2  w-fit text-(--border-color-default) py-3 flex gap-2 outline-none">
        <h6 className="text-(--typography-color-secondary-100)">{text}</h6>
        <span className="justify-center h-4 text-base text-white align-middle material-symbols-outlined">
          north_east
        </span>
      </button>
  );
}