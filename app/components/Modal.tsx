import { ReactNode } from "react";
import Image from "next/image";

export const Modal = ({ children }: { children: ReactNode }) => {
  return (
    <dialog id="modal" className="modal">
      <div className="modal-box relative">
        {children}
        <div className="modal-action m-0"></div>
        <form method="dialog" className="absolute top-2 right-2">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-square btn-ghost border-base-300 border-2">
            <Image
              src="/images/icon-close.svg"
              alt="Close"
              width={20}
              height={20}
            />
          </button>
        </form>
      </div>
    </dialog>
  );
};
