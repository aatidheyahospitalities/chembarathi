import { FrameIcon } from "../lib/icons/FrameIcon";


export default async function commonLinkButton({text,onclick}: {text: string, onclick?: () => void}) {

  return (
      <button onClick={onclick} className="border-b-2  w-fit text-(--border-color-default) py-3 flex gap-2 outline-none">
        <h6 className="text-(--typography-color-secondary-100)">{text}</h6>
        <FrameIcon />
      </button>
  );
}