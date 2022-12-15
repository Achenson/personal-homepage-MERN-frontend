import React, { useEffect, useState } from "react";
import { useMutation } from "urql";

import { ReactComponent as PlusSmSVG } from "../../svgs/plus-sm.svg";
import { ReactComponent as MinusSmSVG } from "../../svgs/minus-sm.svg";

import { ChangeTabMutation } from "../../graphql/graphqlMutations";

import { useTabs } from "../../state/hooks/useTabs";

import { TabDatabase_i } from "../../utils/tabType";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  setWasAnythingClicked: React.Dispatch<React.SetStateAction<boolean>>;
  descriptionCheckbox: boolean;
  setDescriptionCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  dateCheckbox: boolean;
  setDateCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  setWasCheckboxClicked: React.Dispatch<React.SetStateAction<boolean>>;
  rssItemsPerPage: number;
  setRssItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setWasItemsPerPageClicked: React.Dispatch<React.SetStateAction<boolean>>;
  tabID: string;
  rssLinkInput: string;
  setRssLinkInput: React.Dispatch<React.SetStateAction<string>>;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
  currentTab: TabDatabase_i;
}

function EditTab_RSS({
  setWasAnythingClicked,
  descriptionCheckbox,
  setDescriptionCheckbox,
  dateCheckbox,
  setDateCheckbox,
  setWasCheckboxClicked,
  rssItemsPerPage,
  setRssItemsPerPage,
  setWasItemsPerPageClicked,
  tabID,
  rssLinkInput,
  setRssLinkInput,
  globalSettings,
  userIdOrNoId,
  currentTab,
}: Props): JSX.Element {
  const resetTabRssSettings = useTabs((store) => store.resetTabRssSettings);

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  const [itemsPerPageInitial, setItemsPerPageInitial] = useState(
    () => rssItemsPerPage
  );

  useEffect(() => {
    // @ts-ignore
    if (!currentTab.itemsPerPage) {
      setItemsPerPageInitial(globalSettings.itemsPerPage);
    }
    // @ts-ignore
  }, [globalSettings.itemsPerPage, currentTab.itemsPerPage]);

  return (
    <div className="-mb-1">
      <div className="flex items-center mt-2 justify-between">
        <p className="whitespace-nowrap flex-none" style={{ width: "65px" }}>
          RSS link
        </p>
        <input
          type="text"
          // min-w-0 !!
          className="border w-full max-w-6xl pl-px focus-1"
          value={rssLinkInput}
          onChange={(e) => {
            setRssLinkInput(e.target.value);
            setWasAnythingClicked(true);
          }}
        />
      </div>
      <div className="flex items-center mb-2 mt-2 justify-between">
        <p className="whitespace-nowrap w-32">Display</p>
        <div className="flex">
          <div className="flex items-center mr-2">
            <button
              style={{ marginTop: "2px" }}
              className="focus-1-offset-dark"
              onClick={() => {
                setDescriptionCheckbox((b) => !b);
                setWasCheckboxClicked(true);
              }}
              aria-label={"RSS description on/off"}
            >
              <div
                className={`h-3 w-3 cursor-pointer transition duration-75 border-2 border-blueGray-400 ${
                  descriptionCheckbox
                    ? `bg-blueGray-400 bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } `}
              ></div>
            </button>
            <span className="ml-1">Description</span>
          </div>
          <div className="flex items-center">
            <button
              style={{ marginTop: "2px" }}
              className="focus-1-offset-dark"
              onClick={() => {
                setDateCheckbox((b) => !b);
                setWasCheckboxClicked(true);
              }}
              aria-label={"RSS date on/off"}
            >
              <div
                className={`h-3 w-3 cursor-pointer transition duration-75 border-2 border-blueGray-400 ${
                  dateCheckbox
                    ? `bg-blueGray-400 bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } `}
              ></div>
            </button>
            <span className="ml-1">Date</span>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-2 justify-between">
        <p className="whitespace-nowrap w-32">Items per page (5-15)</p>
        <div className="flex items-center">
          <div>
            <div
              className={`bg-blueGray-400`}
              style={{ height: "13px", width: "13px" }}
            >
              <PlusSmSVG
                className="cursor-pointer hover:text-blueGray-500 transition-colors duration-75"
                onClick={() => {
                  if (rssItemsPerPage > 14) {
                    return;
                  }

                  setItemsPerPageInitial(
                    (itemsPerPageInitial) => itemsPerPageInitial + 1
                  );

                  setRssItemsPerPage((itemsPerPage) => itemsPerPage + 1);
                  setWasItemsPerPageClicked(true);
                }}
              />
            </div>
            <div
              className={`bg-blueGray-400`}
              // className={`bg-${uiColor}`}
              style={{ height: "13px", width: "13px" }}
            >
              <MinusSmSVG
                className="cursor-pointer hover:text-blueGray-500 transition-colors duration-75"
                onClick={() => {
                  if (rssItemsPerPage < 6) {
                    return;
                  }

                  setItemsPerPageInitial(
                    (itemsPerPageInitial) => itemsPerPageInitial - 1
                  );

                  setRssItemsPerPage((itemsPerPage) => itemsPerPage - 1);
                  setWasItemsPerPageClicked(true);
                }}
              />
            </div>
          </div>
          <input
            type="number"
            min="5"
            max="15"
            className="border-t border-b border-r w-8 text-center border-gray-300 focus-1"
            value={itemsPerPageInitial}
            onWheel={(event) => event.currentTarget.blur()}
            onChange={(e) => {
              setItemsPerPageInitial(parseInt(e.target.value));
            }}
            onBlur={(e) => {
              if (
                parseInt(e.target.value) < 5 ||
                parseInt(e.target.value) > 15 ||
                e.target.value === ""
              ) {
                setItemsPerPageInitial(rssItemsPerPage);
                return;
              }
              setRssItemsPerPage(parseInt(e.target.value));
              setWasItemsPerPageClicked(true);
            }}
          />
        </div>
      </div>
      <p className="text-center mt-1">
        {" "}
        <span
          className="text-red-600 hover:underline cursor-pointer"
          onClick={() => {
            setDescriptionCheckbox(globalSettings.description);
            setDateCheckbox(globalSettings.date);
            setRssItemsPerPage(globalSettings.itemsPerPage);
            setItemsPerPageInitial(globalSettings.itemsPerPage);

            if (userIdOrNoId) {
              editTab({
                ...currentTab,
                // @ts-ignore
                date: null,
                description: null,
                itemsPerPage: null,
              });
            } else {
              resetTabRssSettings(tabID);
            }
          }}
        >
          RESET
        </span>{" "}
        to default
      </p>
    </div>
  );
}

export default EditTab_RSS;
