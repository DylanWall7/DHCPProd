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

export default function SearchBox({ data }) {
  const randomNumber = Math.floor(Math.random() * 1000);
  return (
    <Table aria-label="Lease List" isCompact>
      <TableHeader>
        <TableColumn>Scope ID</TableColumn>
        <TableColumn>IP Address</TableColumn>
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
