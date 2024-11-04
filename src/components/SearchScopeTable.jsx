import React from "react";
import { Card, CardHeader, CardBody, Divider, Chip } from "@nextui-org/react";

const statusColorMap = {
  ActiveReservation: "success",

  Active: "warning",
};

export default function SearchScopeTable({ dhcpStats, scopeData }) {
  const randomNumber = Math.floor(Math.random() * 1000);
  return (
    <div className="flex flex-col gap-3 ">
      <Card className="w-[450px] bg-[#e8ebef]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">{scopeData?.name}</p>
            <p className="text-small text-default-500">
              Scope ID: {scopeData?.scopeID}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="">
          <h3 className=" text-center text-sm p-2 pb-3 ">SCOPE INFO</h3>

          <div class="grid grid-cols-2 gap-2">
            <div className="justify-evenly text-center text-sm flex flex-row gap-3 ">
              <p className="">Start Range: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3  ">
              <p>{scopeData?.startRange}</p>
            </div>

            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p className="">End Range: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p>{scopeData?.endRange}</p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p className="">Subnet Mask: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3  ">
              <p>{scopeData?.subnetMask}</p>
            </div>
          </div>

          {scopeData?.dhcpOptions?.map((scope) => {
            if (scope.name === "DNS Servers") {
              if (scope.value.length === 3) {
                return (
                  <div className="grid grid-cols-2 gap-2 mt-2 ">
                    <div className="justify-evenly text-sm flex flex-row gap-3 items-center ">
                      <p className="">DNS Servers:</p>
                    </div>
                    <div className="items-center text-sm flex flex-col pb-3">
                      <ul className=" flex justify-evenly">
                        {scope?.value[0]}
                      </ul>
                      <ul className=" flex justify-evenly">
                        {scope?.value[1]}
                      </ul>
                      <ul className=" flex justify-evenly">
                        {scope?.value[2]}
                      </ul>
                    </div>
                  </div>
                );
              } else if (scope.value.length === 2) {
                return (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className=" justify-evenly text-sm flex flex-row gap-3 items-center ">
                      <p className="">DNS Servers:</p>
                    </div>
                    <div className="items-center text-sm flex flex-col pb-3">
                      <ul className=" flex justify-evenly">
                        {scope?.value[0]}
                      </ul>
                      <ul className="flex justify-evenly">{scope?.value[1]}</ul>
                    </div>
                  </div>
                );
              }
            }
          })}
          <Divider />
          <div>
            <h3 className="text-sm text-center p-2 pb-3">SCOPE STATISTICS</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 ">
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p className="">IP's Free: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <Chip variant="dot">{dhcpStats.free}</Chip>
            </div>

            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p className="">IP's In Use: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <Chip variant="dot">{dhcpStats.inUse}</Chip>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p className="">Percent Used: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <Chip variant="dot">{Math.round(dhcpStats.percentageUsed)}%</Chip>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <p className="">IP's Reserved: </p>
            </div>
            <div className=" justify-evenly text-sm flex flex-row gap-3 ">
              <Chip variant="dot">{dhcpStats.reserved}</Chip>
            </div>
          </div>
        </CardBody>
        <Divider />
      </Card>
    </div>
  );
}
