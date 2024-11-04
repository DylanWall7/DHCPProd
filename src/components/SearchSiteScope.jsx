import React, { useState } from "react";
import axios from "axios";
import { Center, Text, Thead, Tbody, Tr, Th, Td, Flex } from "@chakra-ui/react";

import { useTable, useSortBy } from "react-table";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  CardHeader,
  CardBody,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Button as NxtButton } from "@nextui-org/react";
import { Card as NxtCard } from "@nextui-org/react";
import { Input as NxtInput } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { GizmoRequest } from "../authConfig";
import { useMsal } from "@azure/msal-react";
import ScopeLoading from "./ScopeLoading";
import ArrowLeft from "../Images/ArrowLeft.png";
import ArrowDown from "../Images/ArrowDown.png";
import SearchSiteCodeTable from "./SearchSiteCodeTable";

import { Accordion, AccordionItem, Slider } from "@nextui-org/react";

export default function Search() {
  const { instance, accounts } = useMsal();
  const request = {
    ...GizmoRequest,
    account: accounts[0],
  };
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState();
  const [displayNoReservation, setDisplayNoReservation] = useState();
  const [scopeStatistics, setScopeStatistics] = useState([]);
  const [scopeLoading, setScopeLoading] = useState();

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();

    axios({
      url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/scope/site/${userInput}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      dataResponse: "json",
      params: {
        query: userInput,
      },
    })
      .then((response) => {
        setLoading(true);
        setData2(response.data);
        let newArray = [];
        newArray.push(response.data);

        setData(newArray);
      })
      .then(() => {
        setLoading(false);
      })
      //   .then((item) => {
      //     if (item.scopeID > 5) setDisplayNoReservation(true);
      //   })
      .then(() => {
        setTimeout(() => {
          setDisplayNoReservation(false);
        }, 10000);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const ThereIsError = (error) => {
    if (data2.length === 0 && loading === false) {
      return (
        <Center>
          <Text color="red.500">
            <b>No Scopes Found!</b>
          </Text>
        </Center>
      );
    }
  };

  function CustomTable({ columns, data }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable(
        {
          columns,
          data,
        },
        useSortBy
      );

    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows.slice(0, 8000);

    return (
      <>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <Th
                    userSelect="none"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <Flex alignItems="center">
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDownIcon ml={1} w={4} h={4} />
                        ) : (
                          <ChevronUpIcon ml={1} w={4} h={4} />
                        )
                      ) : (
                        ""
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} alignItems="center">
            {firstPageRows.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} alignItems="center">
                  {row.cells.map((cell) => {
                    return (
                      <Td
                        style={{
                          maxWidth: "700px",
                          fontSize: 14,
                          padding: "5px",
                          textAlign: "center",
                        }}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </>
    );
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "All Site Scope Info",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Scope ID",
            accessor: "scopeID",
          },
          {
            Header: "Scope Start Range",
            accessor: "startRange",
          },
          {
            Header: "Scope End Range",
            accessor: "endRange",
          },
          {
            Header: "Subnet Mask",
            accessor: "subnetMask",
          },
          {
            Header: "Lease Time",
            accessor: "duration",
            Cell: ({ value }) => {
              return `${value}`;
            },
          },
        ],
      },
    ],
    []
  );

  //   const NoReservation = (item) => {
  //     if (displayNoReservation === true || item.ipAddress < 5) {
  //       return (
  //         <Center>
  //           <Text color="red.500">
  //             <b>No Site Found!</b>
  //           </Text>
  //         </Center>
  //       );
  //     }
  //   };

  //   const { ScopeData } = data;

  //   const [scopeData1, setScopeData1] = useState([]);

  //   useEffect(() => {
  //     setScopeData1(
  //       ScopeData.map((scope) => ({
  //         ScopeID: scope.scopeID,
  //         ScopeName: scope.name,
  //         Subnet: scope.subnetMask,
  //       }))
  //     );
  //   }, [ScopeData]);

  return (
    <>
      <div className="flex justify-around mt-24 mb-16 ">
        <NxtCard className=" w-[400px] bg-[#e8ebef]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Search for Scopes by Site Code</p>

              <p className="text-small text-default-500">
                List all scopes for a site
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form action="">
              <div className="flex flex-row md:flex-nowrap gap-4  ">
                <NxtInput
                  defaultValue={userInput}
                  // isInvalid={MacRegValidation(userInput) === false}
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  radius="lg"
                  placeholder="Site Code"
                />

                <NxtButton
                  variant="flat"
                  type="submit"
                  isLoading={loading}
                  onClick={handleSubmit}
                  className="w-1/2 bg-[#f4f4f5] hover:text-green-600 hover:bg-gray-300 disabled:hover:text-red-600 disabled:hover:bg-red-100 "
                  disabled={loading || userInput.length !== 8}
                  spinner={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="green"
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
                  }
                  size="md"
                >
                  {loading === true ? "Searching" : "Search"}
                </NxtButton>
              </div>
            </form>
          </CardBody>
        </NxtCard>
      </div>
      {/* <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
        <Box
          boxShadow={"xl"}
          rounded={"lg"}
          p={6}
          backgroundColor={"gray.200"}
          mt={24}
          w={"450px"}
          maxWidth={"450px"}
        >
          <form action="">
            <Text
              textAlign={"center"}
              alignItems={"center"}
              justifyContent={"center"}
              textOverflow={"ellipsis"}
              pb={3}
            >
              Search for Scope's by Site Code
            </Text>
            <InputGroup>
              <Stack
                direction={["column", "row"]}
                spacing="12px"
                textAlign={"center"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Input
                  backgroundColor={"gray.100"}
                  justifyItems={"center"}
                  ml={12}
                  justifyContent={"center"}
                  textAlign={"center"}
                  w={["50%", "50%"]}
                  type="text"
                  placeholder="Site Code"
                  id="search"
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                />
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || userInput.length !== 8}
                  size="md"
                  color="gray.600"
                  outlineColor={"gray.300"}
                >
                  {loading === true ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="sm"
                    />
                  ) : (
                    "Search"
                  )}
                </Button>
              </Stack>
            </InputGroup>
          </form>
        </Box>
      </Box> */}
      <ThereIsError />
      {/* <NoReservation /> */}
      {data2.length !== 0 ? (
        Object.values(data).map((item) => {
          return (
            <div className=" ">
              {/* <CustomTable columns={columns} data={item} key={item.scopeID} /> */}
              <SearchSiteCodeTable data={item} />
              {item.map((scope) => (
                <div className="p-1  ">
                  {/* <Accordion
                    selectionMode="multiple"
                    aria-label={scope.scopeID}
                    variant="bordered"
                    key={scope.scopeID}
                  >
                    <AccordionItem
                      indicator={({ isOpen }) =>
                        isOpen ? (
                          <img
                            width="30"
                            height="30"
                            src={ArrowDown}
                            alt="arrow left"
                          />
                        ) : (
                          <img
                            width="30"
                            height="30"
                            src={ArrowLeft}
                            alt="arrow left"
                          />
                        )
                      }
                      subtitle={
                        <div className="p-2">
                          <Chip
                            size="md"
                            variant="faded"
                            radius="sm"
                            className="capitalize"
                            color="primary"
                          >
                            Scope ID: {scope.scopeID}
                          </Chip>

                          <Chip
                            size="md"
                            variant="faded"
                            radius="sm"
                            className="capitalize ml-2 "
                            color="primary"
                          >
                            Lease Time: {scope.duration}
                          </Chip>
                        </div>
                      }
                      key={scope.scopeID}
                      isCompact
                      aria-label={scope.scopeID}
                      title={
                        <Chip
                          size="md"
                          variant="flat"
                          radius="sm"
                          className="capitalize"
                          color="primary"
                        >
                          {scope.name}
                        </Chip>
                      }
                      onPress={() => {
                        // Check if scopeID is already in scopeStatistics array before making a GET request to avoid duplicate data

                        const dataExists = scopeStatistics.some(
                          (statistics) => statistics.scopeId === scope.scopeID
                        );

                        if (!dataExists) {
                          async function onGet(e) {
                            console.log(scope.scopeID);
                            console.log(scopeStatistics);

                            setScopeLoading(true);
                            const detailurl = `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/statistics/${scope.scopeID}`;

                            async function GetScopeStatistics({ token }) {
                              const headers = new Headers();
                              const bearer = `Bearer ${token}`;

                              headers.append("Authorization", bearer);
                              headers.append(
                                "Content-Type",
                                "application/json"
                              );

                              const options = {
                                method: "GET",
                                headers: headers,
                              };

                              return fetch(detailurl, options)
                                .then(async (response) => response.json())
                                .then((scopeStatistics) => {
                                  // Add scope staticstics to an array

                                  setScopeStatistics((prev) => [
                                    ...prev,
                                    ...scopeStatistics,
                                  ]);
                                  setScopeLoading(false);

                                  console.log(scopeStatistics);
                                })
                                .catch((error) => {
                                  console.log(error.message);
                                  setScopeLoading(false);
                                });
                            }

                            GetScopeStatistics({
                              token: await instance
                                .acquireTokenSilent(request)
                                .then((response) => {
                                  return response.accessToken;
                                }),
                            });
                          }

                          onGet();
                        }
                      }}
                    >
                      <div className="flex flex-col gap-3 p-3 ">
                        <NxtCard className=" p-2  bg-[#e8ebef]">
                          <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                              <p className="text-md">{scope.name}</p>
                              <p className="text-small text-default-500">
                                Scope ID: {scope.scopeID}
                              </p>
                            </div>
                          </CardHeader>
                          <Divider />
                          <CardBody className="">
                            {scopeLoading && (
                              <ScopeLoading loading={scopeLoading} />
                            )}
                            <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2 justify-items-center ">
                              <div class="min-w-0 w-4/6 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
                                <div class="p-4 flex items-center">
                                  <div class="p-3 rounded-full text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
                                    <svg
                                      class="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                      ></path>
                                    </svg>
                                  </div>

                                  <div>
                                    <p class="mb-2 text-md font-medium text-gray-600 dark:text-gray-900">
                                      SCOPE INFO
                                    </p>
                                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                      Start Range: {scope.startRange}
                                    </p>
                                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                      End Range: {scope.endRange}
                                    </p>
                                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                      Subnet Mask: {scope.subnetMask}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="min-w-0 w-4/6 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
                                <div class="p-4 flex items-center">
                                  <div class="p-3 rounded-full text-blue-500 dark:text-blue-100 bg-blue-100 dark:bg-blue-500 mr-4">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-6 w-6"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p class="mb-2 text-md font-medium text-gray-600 dark:text-gray-900">
                                      DNS SERVERS
                                    </p>
                                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-700">
                                      {scope.dhcpOptions.map((scope) => {
                                        if (scope.name === "DNS Servers") {
                                          if (scope.value.length === 3) {
                                            return (
                                              <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className=" text-md flex flex-col pb-3">
                                                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                                    {scope.value[0]}
                                                  </p>
                                                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                                    {scope.value[1]}
                                                  </p>
                                                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                                    {scope.value[2]}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          } else if (scope.value.length === 2) {
                                            return (
                                              <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className=" text-md flex flex-col pb-3">
                                                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                                    {scope.value[0]}
                                                  </p>
                                                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-600">
                                                    {scope.value[1]}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          }
                                        }
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {scopeStatistics.map(
                              (statistics) =>
                                statistics.scopeId === scope.scopeID && (
                                  <div>
                                    <div className="flex justify-center ">
                                      <Table
                                        aria-label="Lease List"
                                        isCompact
                                        className="w-4/6"
                                      >
                                        <TableHeader className="">
                                          <TableColumn className="text-center bg-[#636363] text-white ">
                                            IP's Free
                                          </TableColumn>
                                          <TableColumn className=" bg-[#636363] text-white text-center">
                                            IP's In Use
                                          </TableColumn>
                                          <TableColumn className=" bg-[#636363] text-white  text-center">
                                            Percent Used
                                          </TableColumn>
                                          <TableColumn className=" bg-[#636363] text-white  text-center">
                                            IP's Reserved
                                          </TableColumn>
                                        </TableHeader>
                                        <TableBody
                                          emptyContent={"No Scopes to display."}
                                        >
                                          <TableRow
                                            className="bg-[#f3f2f2] text-center "
                                            key={statistics.scopeId}
                                          >
                                            <TableCell className="w-1/6">
                                              {statistics.free}
                                            </TableCell>
                                            <TableCell className="w-1/6">
                                              {statistics.inUse}
                                            </TableCell>
                                            <TableCell className="w-1/6">
                                              <Slider
                                                aria-label="Player progress"
                                                color="foreground"
                                                hideThumb={true}
                                                isDisabled
                                                defaultValue={Math.round(
                                                  statistics.percentageUsed
                                                )}
                                                className="max-w-md"
                                              />

                                              <Chip variant="dot">
                                                {Math.round(
                                                  statistics.percentageUsed
                                                )}
                                                %
                                              </Chip>
                                            </TableCell>
                                            <TableCell className="w-1/6">
                                              {statistics.reserved}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div> */}
                  {/* <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 justify-items-center">
                                      <div class="min-w-0 w-4/6 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
                                        <div class="p-2 flex items-center justify-center ">
                                          <div className="">
                                            <p class="mb-2 text-md font-medium text-gray-600 dark:text-gray-900">
                                              IP's Free
                                            </p>
                                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-600 flex flex-col items-center">
                                              <Chip variant="dot">
                                                {statistics.free}
                                              </Chip>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="min-w-0  w-4/6 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
                                        <div class="p-2 flex items-center justify-center ">
                                          <div className="">
                                            <p class="mb-2 text-md font-medium text-gray-600 dark:text-gray-900">
                                              IP's In Use
                                            </p>
                                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-600 flex flex-col items-center">
                                              <Chip variant="dot">
                                                {statistics.inUse}
                                              </Chip>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="min-w-0  w-4/6 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
                                        <div class="p-2 flex items-center justify-center ">
                                          <div className="">
                                            <p class="mb-2 text-md font-medium text-gray-600 dark:text-gray-900">
                                              Percent Used
                                            </p>
                                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-600  ">
                                              <div className="flex flex-col items-center">
                                                <Slider
                                                  aria-label="Player progress"
                                                  color="foreground"
                                                  hideThumb={true}
                                                  isDisabled
                                                  defaultValue={Math.round(
                                                    statistics.percentageUsed
                                                  )}
                                                  className="max-w-md"
                                                />
                                                <Chip variant="dot">
                                                  {Math.round(
                                                    statistics.percentageUsed
                                                  )}
                                                  %
                                                </Chip>
                                              </div>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="min-w-0  w-4/6 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
                                        <div class="p-2 flex items-center justify-center ">
                                          <div className="">
                                            <p class="mb-2 text-md font-medium text-gray-600 dark:text-gray-900">
                                              IP's Reserved
                                            </p>
                                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-600 flex flex-col items-center">
                                              <Chip variant="dot">
                                                {statistics.reserved}
                                              </Chip>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                  {/* </div>
                                )
                            )} */}
                  {/* 
                              <h3 className=" text-center text-sm p-2 pb-3 ">
                                SCOPE INFO
                              </h3>
                              <div class="grid grid-cols-2 gap-2">
                                <div className="justify-evenly text-center text-sm flex flex-row gap-3 ">
                                  <p className="">Start Range: </p>
                                </div>
                                <div className=" justify-evenly text-sm flex flex-row gap-3  ">
                                  <p>{scope.startRange}</p>
                                </div>

                                <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                  <p className="">End Range: </p>
                                </div>
                                <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                  <p>{scope.endRange}</p>
                                </div>
                                <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                  <p className="">Subnet Mask: </p>
                                </div>
                                <div className=" justify-evenly text-sm flex flex-row gap-3  ">
                                  <p>{scope.subnetMask}</p>
                                </div>
                              </div>
                              {scope.dhcpOptions.map((scope) => {
                                if (scope.name === "DNS Servers") {
                                  if (scope.value.length === 3) {
                                    return (
                                      <div className="grid grid-cols-2 gap-2 mt-2 ">
                                        <div className="justify-evenly text-sm flex flex-row gap-3 items-center ">
                                          <p className="">DNS Servers:</p>
                                        </div>
                                        <div className="items-center text-sm flex flex-col pb-3">
                                          <ul className=" flex justify-evenly">
                                            {scope.value[0]}
                                          </ul>
                                          <ul className=" flex justify-evenly">
                                            {scope.value[1]}
                                          </ul>
                                          <ul className=" flex justify-evenly">
                                            {scope.value[2]}
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
                                            {scope.value[0]}
                                          </ul>
                                          <ul className="flex justify-evenly">
                                            {scope.value[1]}
                                          </ul>
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                              <Divider />
                              <>
                                {scopeStatistics.map(
                                  (statistics) =>
                                    statistics.scopeId === scope.scopeID && (
                                      <div key={statistics.scopeId}>
                                        <div>
                                          <h3 className="text-sm text-center p-2 pb-3">
                                            SCOPE STATISTICS
                                          </h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 ">
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <p className="">IP's Free: </p>
                                          </div>
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <Chip variant="dot">
                                              {statistics.free}
                                            </Chip>
                                          </div>

                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <p className="">IP's In Use: </p>
                                          </div>
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <Chip variant="dot">
                                              {statistics.inUse}
                                            </Chip>
                                          </div>
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <p className="">Percent Used: </p>
                                          </div>
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <Slider
                                              aria-label="Player progress"
                                              color="foreground"
                                              hideThumb={true}
                                              isDisabled
                                              defaultValue={
                                                statistics.percentageUsed
                                              }
                                              className="max-w-md"
                                            />
                                            <Chip variant="dot">
                                              {Math.round(
                                                statistics.percentageUsed
                                              )}
                                              %
                                            </Chip>
                                          </div>
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <p className="">IP's Reserved: </p>
                                          </div>
                                          <div className=" justify-evenly text-sm flex flex-row gap-3 ">
                                            <Chip variant="dot">
                                              {statistics.reserved}
                                            </Chip>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                )}
                              </> */}
                  {/* </CardBody>
                        </NxtCard>
                      </div>
                    </AccordionItem>
                  </Accordion> */}
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <Center>
          <Text color="red.500">
            <b></b>
          </Text>
        </Center>
      )}
    </>
  );
}
