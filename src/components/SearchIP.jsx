import React, { useState } from "react";
import axios from "axios";
import {
  InputGroup,
  Input,
  Box,
  Center,
  Text,
  useColorModeValue,
  Stack,
  Button,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import AddResNoLease from "./AddResNoLease";

export default function Search() {
  const [data, setData] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState();
  const [displayNoReservation, setDisplayNoReservation] = useState();

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    axios({
      url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/reservation/${userInput}`,
      method: "GET",
      dataResponse: "json",
      params: {
        query: userInput,
      },
    })
      .then((response) => {
        setLoading(true);
        setData(response.data);
      })
      .then(() => {
        setLoading(false);
      })
      .then(() => {
        if (data.ipAddress > 5) setDisplayNoReservation(true);
      })
      .then(() => {
        setTimeout(() => {
          setDisplayNoReservation(false);
        }, 10000);
      })
      .catch((error) => {
        if (error.code) {
          setLoading(false);
        }
      });
  };

  const ThereIsError = (error) => {
    if (data.length === 0 && loading === false) {
      return (
        <Center>
          <Text color="red.500">
            <b>No Reservation Found!</b>
          </Text>
        </Center>
      );
    }
  };

  return (
    <Box>
      <Box
        alignItems={"center"}
        justifyContent={"left"}
        marginLeft={24}
        display={"flex"}
      >
        <Box
          boxShadow={"xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
          justifyContent={"center"}
          alignItems={"center"}
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
                  type="text"
                  placeholder="IP Address"
                  w={["50%", "50%"]}
                  id="search"
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                />
                {/* <input
                class="w-half py-3 pl-3 pr-16 text-sm border-2 border-gray-200 rounded-lg bg-slate-100"
                id="text"
                type="text"
                placeholder="IP Address"
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
              /> */}

                {/* <AddAssetTest /> */}

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
                <AddResNoLease />
              </Stack>
            </InputGroup>
          </form>
        </Box>
      </Box>
      <ThereIsError />
      {/* <AddResForm /> */}

      {data.ipAddress !== null && data.ipAddress !== undefined ? (
        <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
          <Box
            backgroundColor={"gray.100"}
            mt={6}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
            ml={5}
            w={"600px"}
          >
            <TableContainer>
              <Table
                size="sm"
                textAlign={"center"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Thead>
                  <Tr>
                    <Th p={0}></Th>
                    <Th
                      width={"100%"}
                      textAlign={"left"}
                      justifyContent={"left"}
                      alignItems={"left"}
                      p={0}
                    >
                      Reservation Info
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Reservation IP:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {data.ipAddress}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Scope ID:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {data.scopeId}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      MAC Address:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      maxW={"200px"}
                    >
                      {data.clientId}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Reservation Name:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {data.name}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      display={"flex"}
                    >
                      Description:
                    </Td>

                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {data.description}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      ) : (
        <Box></Box>
      )}
      {/* <AddResForm /> */}
    </Box>
  );
}

// <Box
//   backgroundColor={"gray.100"}
//   w={"400px"}
//   boxShadow={"2xl"}
//   mt={6}
//   rounded={"lg"}
//   p={6}
//   textAlign={"center"}
// >
//   <Heading fontSize={"1xl"} fontFamily={"body"}>
//     Search to Display Reservation Data
//   </Heading>
// </Box>;
