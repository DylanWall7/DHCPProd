import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import Table from "./Table";

import {
  InputGroup,
  Input,
  Box,
  Text,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";

function TestTable() {
  const Genres = ({ values }) => {
    return (
      <>
        {values.map((genre, idx) => {
          return (
            <span key={idx} className="badge">
              {genre}
            </span>
          );
        })}
      </>
    );
  };

  const [userInput, setUserInput] = useState([]);

  // data state to store the TV Maze API data. Its initial value is an empty array
  const columns = useMemo(
    () => [
      {
        Header: "Scope Name",
        columns: [
          {
            Header: "Scope Name",
            accessor: "name",
          },
          {
            Header: "",
            accessor: "show.type",
          },
        ],
      },
      {
        Header: "Scope Details",
        columns: [
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
        ],
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect((userInput) => {
    (async () => {
      const result = await axios(
        `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/scope/site/MEICAIAO`
      );
      setData(result.data);
    })();
  }, []);

  return (
    <div className="App">
      <Box
        boxShadow={"xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundColor={"gray.200"}
        mb={3}
      >
        <form action="">
          <Text
            textAlign={"center"}
            alignItems={"center"}
            justifyContent={"center"}
            textOverflow={"ellipsis"}
            width={"400px"}
            color={useColorModeValue("gray.700", "gray.400")}
            pb={3}
          >
            Search for a Reservation by IP Address
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
                width={"100%"}
                type="text"
                placeholder="Reservation IP"
                id="search"
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
              />
              {/* <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
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
              </Button> */}
            </Stack>
          </InputGroup>
        </form>
      </Box>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default TestTable;
