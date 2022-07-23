import ColorBoxStyles from "./ColorBox.module.scss";

type ColorBoxProps = {
  colorName: string;
  colorValue: string;
  style?: React.CSSProperties;
};

type AddColorBoxProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const AddColorBox = ({ onClick }: AddColorBoxProps) => {
  return (
    <div
      className={ColorBoxStyles["add-color-box-container"]}
      onClick={onClick}
    >
      <div className={ColorBoxStyles["text-container"]}>
        <span className={ColorBoxStyles["text-container__text"]}>
          Add new color
        </span>
      </div>
    </div>
  );
};

const ColorBox = ({ colorName, colorValue, style }: ColorBoxProps) => {
  return (
    <div className={ColorBoxStyles["color-box-container"]} style={style}>
      <div
        className={ColorBoxStyles["color-box"]}
        style={{
          backgroundColor: `${colorValue}`,
        }}
      ></div>
      <div className={ColorBoxStyles["text-container"]}>
        <span
          contentEditable
          suppressContentEditableWarning
          spellCheck="false"
          className={ColorBoxStyles["text-container__color-name"]}
        >
          {colorName ? colorName : colorValue}
        </span>
        <span
          contentEditable
          suppressContentEditableWarning
          spellCheck="false"
          className={ColorBoxStyles["text-container__color-value"]}
          dangerouslySetInnerHTML={{ __html: colorValue }}
        ></span>
      </div>
    </div>
  );
};

export default ColorBox;
