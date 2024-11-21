import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

const statusColorMap = {
  ActiveReservation: "success",

  Active: "warning",
};

const Loader = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="12" r="3" opacity="1">
        <animate
          id="spinner_qYjJ"
          begin="0;spinner_t4KZ.end-0.25s"
          attributeName="opacity"
          dur="0.75s"
          values="1;.2"
          fill="freeze"
        />
      </circle>
      <circle cx="12" cy="12" r="3" opacity=".4">
        <animate
          begin="spinner_qYjJ.begin+0.15s"
          attributeName="opacity"
          dur="0.75s"
          values="1;.2"
          fill="freeze"
        />
      </circle>
      <circle cx="20" cy="12" r="3" opacity=".3">
        <animate
          id="spinner_t4KZ"
          begin="spinner_qYjJ.begin+0.3s"
          attributeName="opacity"
          dur="0.75s"
          values="1;.2"
          fill="freeze"
        />
      </circle>
    </svg>
  );
};

export default function SearchBox({ data, data3 }) {
  const randomNumber = Math.floor(Math.random() * 1000);

  return (
    <Table aria-label="Lease List" isCompact>
      <TableHeader>
        <TableColumn>Scope ID</TableColumn>
        <TableColumn>IP Address</TableColumn>
        <TableColumn>Scope</TableColumn>
        <TableColumn>MAC Address</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Reservation Status</TableColumn>
        <TableColumn>Lease Expire</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No lease to display."}>
        {data.map((row) => (
          <TableRow key={randomNumber}>
            <TableCell>{row.scopeId}</TableCell>
            <TableCell>{row.ipAddress}</TableCell>
            <TableCell>{!data3 ? <Loader /> : data3?.name}</TableCell>

            <TableCell>{row.clientId}</TableCell>
            <TableCell>{row.hostName}</TableCell>
            <TableCell>
              <Chip
                className="capitalize "
                color={statusColorMap[row.addressState]}
                size="sm"
                variant="flat"
              >
                {row.addressState === "ActiveReservation"
                  ? "Reserved"
                  : "Not Reserved"}
              </Chip>
            </TableCell>
            <TableCell>{row.leaseExpire}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
