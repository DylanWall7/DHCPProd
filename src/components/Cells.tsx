import React from "react";
import {
  Popover,
  Whisper,
  Checkbox,
  Dropdown,
  IconButton,
  Table,
  CellProps,
} from "rsuite";
import MoreIcon from "@rsuite/icons/legacy/More";
import PlusIcon from "@rsuite/icons/Plus";

const { Cell } = Table;

export const NameCell = ({ rowData, dataKey, ...props }: CellProps) => {
  const speaker = (
    <Popover title="Description">
      <p>
        <b>Name:</b> {rowData.hostName}
      </p>
      <p>
        <b>Gender:</b> {rowData.hostName}
      </p>
      <p>
        <b>City:</b> {rowData.hostName}
      </p>
      <p>
        <b>Street:</b> {rowData.hostName}
      </p>
    </Popover>
  );

  return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a>{dataKey ? rowData[dataKey] : null}</a>
      </Whisper>
    </Cell>
  );
};

export const ImageCell = ({ rowData, dataKey, ...props }: CellProps) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div
      style={{
        width: 40,
        height: 40,
        background: "#f5f5f5",
        borderRadius: 6,
        marginTop: 2,
        overflow: "hidden",
        display: "inline-block",
      }}
    >
      <img src={rowData[dataKey!]} width="40" />
    </div>
  </Cell>
);

export const CheckCell = ({
  rowData,
  onChange,
  checkedKeys,
  dataKey,
  ...props
}: CellProps & {
  checkedKeys: number[];
  onChange: (value: any, checked: boolean) => void;
}) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: "46px" }}>
      <Checkbox
        value={rowData}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey!])}
      />
    </div>
  </Cell>
);

const renderMenu = ({ onClose, left, top, className, rowData }: any, ref) => {
  const handleSelect = (eventKey) => {};
  return <IconButton icon={<PlusIcon />}>Add</IconButton>;
};

export const ActionCell = (props, rowData) => {
  return (
    <Cell {...props} className="link-group">
      <button
        class=" mt-0  mb-0 p-1 text-black bg-green-600 rounded-full"
        type="button"
        // onClick={() => alert(JSON.stringify(rowData, null, 2))}

        isLoading="true"
      >
        <svg
          class="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    </Cell>
  );
};
