"use client";

import { deleteEnquiry } from "@/app/admin/actions";

export default function DeleteEnquiryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form
      action={deleteEnquiry}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete the message from ${name}? This can't be undone.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete the message from ${name}`}
        className="rounded-sm border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition-colors hover:border-red-400 hover:bg-red-500/10 hover:text-red-200"
      >
        Delete
      </button>
    </form>
  );
}
