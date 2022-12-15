import React from "react";

interface Props {
  textAreaValue: string | null;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string | null>>;
  setWasAnythingClicked: React.Dispatch<React.SetStateAction<boolean>>;
  noteHeight: number | null;
}

function EditTab_notes({
  textAreaValue,
  setTextAreaValue,
  setWasAnythingClicked,
  noteHeight,
}: Props): JSX.Element {
  function calcNumberOfRows(noteHeight: number) {
    if (noteHeight <= 346) {
      return 8;
    }

    return 9 + Math.ceil((noteHeight - 370) / 24);
  }

  return (
    <div className="mt-2">
      {/* <p>{noteHeight?.toString()}</p> */}
      <textarea
        value={textAreaValue as string}
        className="h-full w-full overflow-visible pl-px pr-px border font-mono resize-none focus-1"
        // rows={(currentTab[0].noteInput as string).length / 30}
        // rows={8}
        rows={calcNumberOfRows(noteHeight as number)}
        onChange={(e) => {
          setTextAreaValue(e.target.value);
          setWasAnythingClicked(true);
        }}
      ></textarea>
    </div>
  );
}

export default EditTab_notes;
