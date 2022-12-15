import React, { useEffect, useState } from "react";
import { useMutation, UseQueryState, OperationContext } from "urql";

import {
  ChangeSettingsMutation,
  BackgroundImgUploadMutation,
} from "../../graphql/graphqlMutations";

import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  xsScreen: boolean;
  globalSettings: GlobalSettingsState;
  backgroundImgResults: UseQueryState<
    any,
    {
      userId: string | null;
    }
  >;
  reexecuteBackgroundImg: (
    opts?: Partial<OperationContext> | undefined
  ) => void;
  hiddenFileInput: React.RefObject<HTMLInputElement>;
  setDbFilesError: React.Dispatch<React.SetStateAction<string | null>>;
}

function BackgroundSettings_Upload({
  xsScreen,
  globalSettings,
  backgroundImgResults,
  reexecuteBackgroundImg,
  hiddenFileInput,
  setDbFilesError,
}: Props): JSX.Element {
  const uiColor = globalSettings.uiColor;

  const [uploadFile, setUploadFile] = useState("");

  const [changeSettingsResult, changeSettings] = useMutation<
    any,
    GlobalSettingsState
  >(ChangeSettingsMutation);

  const [, uploadBackgroundImg] = useMutation(BackgroundImgUploadMutation);

  useEffect(() => {
    if (!backgroundImgResults) return;
    if (!backgroundImgResults?.data?.backgroundImg?.backgroundImgUrl) return;

    let backgroundImgUrl_cut =
      backgroundImgResults?.data?.backgroundImg?.backgroundImgUrl?.replace(
        /background_img\/\w+\/\d+_/,
        ""
      );
    let backgroundImgUrl_cut2 = backgroundImgUrl_cut?.replace(/\.\w+$/, "");

    setUploadFile(backgroundImgUrl_cut2);
  }, [backgroundImgResults]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async ({
    target: { validity, files: file },
  }) => {
    if (validity.valid) {
      await uploadBackgroundImg({ file }).then((res) => {
        // @ts-ignore
        console.log(res?.operation?.variables?.file[0]?.name);

        if (res.error?.message === "[Network] Unsupported Media Type") {
          setDbFilesError("Upload a jpg or png file no larger than 10MB");
          console.log("Upload a .jpg or .png file no larger than 10MB");
        } else {
          setDbFilesError(null);
        }
      });
      reexecuteBackgroundImg({ requestPolicy: "network-only" });
      await changeSettings({
        ...globalSettings,
        defaultImage: "customBackground",
      });
    }
  };

  return (
    <div>
      <form className={`flex justify-start items-center`}>
        <button
          className={`border border-${uiColor} rounded-md px-1 pb-px mr-1 hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
          focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
          style={{ height: "26px" }}
          onClick={(e) => {
            e.preventDefault();
            console.log("click");
            hiddenFileInput.current?.click();
          }}
        >
          Browse...
        </button>
        <div
          className={`bg-blueGray-50 pl-px ${
            xsScreen ? "w-60" : "w-72"
          } border border-gray-300 align-text-bottom`}
          style={{ height: "26px" }}
        >
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {(() => {
              if (
                globalSettings.defaultImage === "customBackground" &&
                uploadFile
              ) {
                return uploadFile;
              }

              if (globalSettings.defaultImage !== "customBackground") {
                if (!uploadFile) {
                  // only returned if no image for uploaded yet
                  return "jpg/png file up to 10MB";
                } else {
                  return "";
                }
              }
            })()}
          </p>
        </div>
        <input
          type="file"
          name="file"
          required
          // @ts-ignore
          onChange={handleChange}
          style={{ display: "none" }}
          ref={hiddenFileInput}
        />
      </form>
    </div>
  );
}

export default BackgroundSettings_Upload;
