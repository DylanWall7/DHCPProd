import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function SearchSiteCodeTable({ data }) {
  return (
    <div>
      <Table
        aria-label="Lease List"
        isCompact
        classNames={{
          wrapper: ["bg-[#e8ebef] border border-divider"],
          th: ["text-black ", "border-b", "border-divider"],
          td: [
            // changing the rows border radius

            // first
            "group-data-[first=true]:first:before:rounded-none border-t border-divider ",
            "group-data-[first=true]:last:before:rounded-none",

            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none  ",
          ],
        }}
      >
        <TableHeader className="">
          <TableColumn className="text-center bg-[#e8ebef]">
            Scope Name
          </TableColumn>
          <TableColumn className=" bg-[#e8ebef]">Scope ID</TableColumn>
          <TableColumn className=" bg-[#e8ebef]">Scope Start Range</TableColumn>
          <TableColumn className=" bg-[#e8ebef]">Scope End Range</TableColumn>
          <TableColumn className=" bg-[#e8ebef]">Subnet Mask</TableColumn>
          <TableColumn className="bg-[#e8ebef]">Lease Time</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No Scopes to display."}>
          {data.map((row) => (
            <TableRow className="bg-[#e8ebef]" key={row.scopeID}>
              <TableCell className="">{row.name}</TableCell>
              <TableCell>{row.scopeID}</TableCell>
              <TableCell>{row.startRange}</TableCell>
              <TableCell>{row.endRange}</TableCell>
              <TableCell>{row.subnetMask}</TableCell>
              <TableCell>{row.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
