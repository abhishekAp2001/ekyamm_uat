// MySelect.jsx
import Select from "react-select";

export default function MySelect(props) {
  return (
    <Select
      {...props}
      styles={{
        ...props.styles,
        control: (base, state) => ({
          ...base,
          cursor: "pointer",
          ...(props.styles?.control
            ? props.styles.control(base, state)
            : {}),
        }),
      }}
    />
  );
}
