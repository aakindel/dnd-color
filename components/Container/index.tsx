import ContainerStyles from "./Container.module.scss";

type ContainerProps = {
  type?: string;
  width?: number;
  children?: React.ReactNode;
};

const BasicContainer = ({
  width = 900,
  children,
}: {
  width?: number;
  children?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        maxWidth: "100%",
        padding: "0 96px",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
};

const Container = ({ type, width, children }: ContainerProps) => {
  switch (type) {
    case "page":
      return (
        <BasicContainer width={width}>
          <div style={{ marginBottom: "108px" }}></div>
          {children}
        </BasicContainer>
      );
    default:
      return <BasicContainer width={width}>{children}</BasicContainer>;
  }
};

export default Container;
