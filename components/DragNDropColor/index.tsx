// https://www.youtube.com/watch?v=Q1PYQPK9TaM
// https://github.com/atlassian/react-beautiful-dnd
//   https://react-beautiful-dnd.netlify.app/iframe.html?id=board--simple

// https://github.com/atlassian/react-beautiful-dnd/blob/2360665305b854434e968e41c7b4105009b73c40/src/animation.js (transition objects)
// https://github.com/atlassian/react-beautiful-dnd/blob/2360665305b854434e968e41c7b4105009b73c40/src/view/draggable/get-style.js (drag style)
// https://github.com/atlassian/react-beautiful-dnd/blob/master/src/view/draggable/draggable.jsx (draggable with provided stuff)
// https://github.com/atlassian/react-beautiful-dnd/blob/2360665305b854434e968e41c7b4105009b73c40/docs/guides/types.md (drrag types)

import { SyntheticEvent, useState, useRef, useEffect } from "react";
import ColorBox, { AddColorBox } from "../ColorBox";
import DragNDropColorStyles from "./DragNDropColor.module.scss";

type crudePaletteObjectType = {
  [key: string | number]:
    | string
    | {
        [key: string | number]: string;
      };
};

type colorObjectType = {
  colorName: string;
  colorValue: string;
};

type paletteObjectType = {
  name: string;
  items: colorObjectType[];
};

type paletteListType = paletteObjectType[];

type DragNDropColorProps = {
  crudePaletteObjectData?: crudePaletteObjectType;
};

type dragStartProps = {
  event: SyntheticEvent;
  params: {
    paletteIndex: number;
    colorIndex: number;
  };
};

const gridColors: crudePaletteObjectType = {
  green: {
    "Green 200": "rgba(184, 207, 187, 1)",
    "Green 100": "rgba(219, 237, 219, 1)",
    // "Green 30": "rgba(244, 248, 243, 0.7)",
    // "Green 50": "rgba(237, 243, 236, 1)",
  },
  red: {
    "Red 200": "rgba(239, 186, 179, 1)",
    "Red 100": "rgba(255, 226, 221, 1)",
    // "Red 50": "rgba(253, 235, 236, 1)",
    // "Red 30": "rgba(253, 245, 243, 0.7)",
  },
  // blue: {
  //   "Blue 200": "rgba(170, 203, 223, 1)",
  //   "Blue 100": "rgba(211, 229, 239, 1)",
  //   "Blue 50": "rgba(231, 243, 248, 1)",
  //   "Blue 30": "rgba(241, 248, 251, 0.7)",
  // },
};

const convertPaletteObjectToList = (
  crudePaletteObjectData: crudePaletteObjectType
) => {
  return Object.entries(crudePaletteObjectData).map(
    ([paletteName, crudePaletteItemsObj]) => {
      const paletteObject: paletteObjectType = {} as paletteObjectType;
      paletteObject["name"] = paletteName;
      paletteObject["items"] = Object.entries(crudePaletteItemsObj).map(
        ([colorName, colorValue]) => {
          // https://stackoverflow.com/a/45339463 : ts empty {} for typed var
          const colorObject: colorObjectType = {} as colorObjectType;
          colorObject["colorName"] = colorName;
          colorObject["colorValue"] = colorValue;
          return colorObject;
        }
      );

      return paletteObject;
    }
  );
};

const DragNDropColor = ({
  crudePaletteObjectData = gridColors,
}: DragNDropColorProps) => {
  // const [colorData, setColorData] = useState(crudePaletteObjectData);
  const [paletteList, setPaletteList] = useState<paletteListType>(
    convertPaletteObjectToList(crudePaletteObjectData)
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragItemRef = useRef<undefined | dragStartProps["params"]>();
  const dragNodeRef = useRef<
    undefined | EventTarget | dragStartProps["params"]
  >();

  const handleDragStart = (
    event: dragStartProps["event"],
    params: dragStartProps["params"]
  ) => {
    // console.log("drag starting", event, params);
    dragItemRef.current = params;
    dragNodeRef.current = event.target;
    dragNodeRef.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  };

  function moveBetweenArrays(
    arr1: object[],
    arr2: object[],
    oldIndex: number,
    newIndex: number
  ) {
    // https://stackoverflow.com/a/5306832 : move arr elements
    const removed_item = arr1.splice(oldIndex, 1)[0];
    arr2.splice(newIndex, 0, removed_item);
  }

  const handleDragEnter = (
    event: dragStartProps["event"],
    params: dragStartProps["params"]
  ) => {
    if (
      dragItemRef.current?.paletteIndex !== params.paletteIndex ||
      dragItemRef.current?.colorIndex !== params.colorIndex
    ) {
      console.log("Entering a drag target", params);
      // console.log("Target is NOT the same as dragged item");
      const currentItem = dragItemRef.current;

      setPaletteList((oldPaletteList) => {
        const newPaletteList = JSON.parse(JSON.stringify(oldPaletteList));
        const testArr = [...newPaletteList];
        dragItemRef.current = params;
        currentItem &&
          moveBetweenArrays(
            newPaletteList[currentItem.paletteIndex]["items"],
            newPaletteList[params.paletteIndex]["items"],
            currentItem.colorIndex,
            params.colorIndex
          );
        // console.log(JSON.stringify(testArr));
        localStorage.setItem("List", JSON.stringify(newPaletteList));
        return newPaletteList;
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    (dragNodeRef.current as HTMLDivElement).removeEventListener(
      "dragend",
      handleDragEnd
    );
    dragItemRef.current = undefined;
    dragNodeRef.current = undefined;
  };

  const draggingStyles = (params: dragStartProps["params"]) => {
    if (
      dragItemRef.current !== undefined &&
      dragItemRef.current.paletteIndex === params.paletteIndex &&
      dragItemRef.current.colorIndex === params.colorIndex
    ) {
      return `${DragNDropColorStyles["dnd-item"]} ${DragNDropColorStyles["current"]}`;
    }
    return DragNDropColorStyles["dnd-item"];
  };

  return (
    <div style={{ marginBottom: "48px" }}>
      <div className={DragNDropColorStyles["dnd-container"]}>
        {paletteList.map((paletteObject, paletteIndex) => {
          return (
            <div key={paletteIndex}>
              <h4 style={{ fontWeight: "600" }}>{paletteObject.name}</h4>
              <div
                className={DragNDropColorStyles["dnd-group"]}
                onDragEnter={
                  isDragging && !paletteObject.items.length
                    ? (event) =>
                        handleDragEnter(event, {
                          paletteIndex,
                          colorIndex: 0,
                        })
                    : undefined
                }
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                  transition:
                    "background-color 0.2s ease, height 0.2s ease, opacity 0.1s ease",
                }}
              >
                {paletteObject.items.map((colorObj, colorIndex) => {
                  return (
                    <div
                      className={
                        isDragging
                          ? draggingStyles({
                              paletteIndex,
                              colorIndex,
                            })
                          : DragNDropColorStyles["dnd-item"]
                      }
                      onDragStart={(event) => {
                        handleDragStart(event, {
                          paletteIndex,
                          colorIndex,
                        });
                      }}
                      onDragEnter={
                        isDragging
                          ? (event) =>
                              handleDragEnter(event, {
                                paletteIndex,
                                colorIndex,
                              })
                          : undefined
                      }
                      draggable
                      style={{
                        transition:
                          "background-color 0.2s ease, opacity 0.1s ease",
                      }}
                      key={colorIndex}
                      // style={{ borderRadius: "5px" }}
                    >
                      <ColorBox
                        colorName={colorObj["colorName"]}
                        colorValue={colorObj["colorValue"]}
                      />
                    </div>
                  );
                })}
                <AddColorBox
                  onClick={() => {
                    setPaletteList((oldPaletteList) => {
                      const newPaletteList = JSON.parse(
                        JSON.stringify(oldPaletteList)
                      );

                      const newColorObj = {
                        colorName: "New",
                        colorValue: "#fff",
                      };

                      newPaletteList[paletteIndex]["items"].push(newColorObj);
                      return newPaletteList;
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          backgroundColor: "#F9F5F1",
          width: "100%",
          borderRadius: "5px",
          padding: "16px",
          fontSize: "14px",
        }}
      >
        <pre>{JSON.stringify(paletteList, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DragNDropColor;
