import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "semantic-ui-react";
import {
  InputGroup,
  Input,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
} from "@chakra-ui/react";
import AddResForm from "./AddResForm";
import { useDisclosure } from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useMsal } from "@azure/msal-react";

export default function SearchLeases() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState();
  const [displayNoReservation, setDisplayNoReservation] = useState();

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const { instance, accounts } = useMsal();

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    axios({
      url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/leases/${userInput}`,
      method: "GET",
      dataResponse: "json",
      params: {
        query: userInput,
      },
    })
      .then((response) => {
        setLoading(true);
        setData2(response.data);
        // let newArray = [];
        // newArray.push(response.data);

        // setData(newArray);
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
            <b>No Reservations Found!</b>
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
    const firstPageRows = rows.slice(0, 2000);

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
                    style={{
                      padding: "10px",
                    }}
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
                          maxWidth: "275px",
                          fontSize: 14,
                          padding: "8px",
                          textAlign: "center",
                          alignItems: "center",
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

  const columns = React.useMemo(() => [
    {
      Header: "All Scope Leases",
      columns: [
        {
          Header: "IP Address",
          accessor: "ipAddress",
        },
        {
          Header: "MAC Address",
          accessor: "clientId",
        },
        {
          Header: "name",
          accessor: "hostName",
        },
        // {
        //   Header: "State",
        //   accessor: "addressState",
        // },
        // {
        //   Header: "Lease Expires",
        //   accessor: "leaseExpire",
        // },
        {
          Header: "Action",
          accessor: "action",
          Cell: ({ value }) => <AddResForm data={value} />,
        },
      ],
    },
  ]);

  const data99 = Object.values(data2).map((item) => ({
    ...item,
    action: item,
  }));

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
    <Box>
      <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
        <Box
          boxShadow={"xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
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
              width={"400px"}
              pb={3}
            >
              Search for All Leases by Scope ID
            </Text>
            <InputGroup>
              <Stack
                direction={["column", "row"]}
                spacing="12px"
                justifyContent={"center"}
                justifyItems={"center"}
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
                  placeholder="Scope ID"
                  id="search"
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                />
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || userInput.length < 8}
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
      </Box>
      <ThereIsError />

      {/* <NoReservation /> */}

      {data2.length !== 0 ? (
        <Box
          backgroundColor={"gray.100"}
          mt={6}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
        >
          <CustomTable columns={columns} data={data99} />
        </Box>
      ) : (
        <Center>
          <Text color="red.500">
            <b></b>
          </Text>
        </Center>
      )}
    </Box>
  );
}

/* <button
                  disabled={value.addressState !== "Active"}
                  onClick={() => handleEdit(value)}
                >
                  Convert
                </button> */
