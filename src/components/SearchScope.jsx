import React, { useState } from "react";
import axios from "axios";
import { Box, Center, Text } from "@chakra-ui/react";
import { CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Button as NxtButton } from "@nextui-org/react";
import { Card as NxtCard } from "@nextui-org/react";
import { Input as NxtInput } from "@nextui-org/react";
import SearchScopeTable from "./SearchScopeTable";

export default function SearchScope() {
  const [dhcpStats, setDhcpStats] = useState([]);
  const [scopeData, setScopeData] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [dhcpOptions, setDhcpOptions] = useState([]);
  const [loading, setLoading] = useState();
  const [displayError, setDisplayError] = useState(false);

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();

    axios
      .all([
        axios.get(
          `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/statistics/${userInput}`
        ),
        axios.get(
          `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/scope/${userInput}`
        ),
      ])
      .then(
        axios.spread((obj1, obj2) => {
          // Both requests are now complete
          setLoading(true);
          setDhcpStats(obj1.data[0]);

          setScopeData(obj2.data);
        })
      )
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        if (error.code) {
          setLoading(false);
          setDisplayError(true);
        }
      });
  };

  setTimeout(() => {
    setDisplayError(false);
  }, 10000);

  const ThereIsError = (error) => {
    if (dhcpStats === undefined && loading === false) {
      return (
        <Center>
          <Text color="red.500">
            <b>No Scope Found!</b>
          </Text>
        </Center>
      );
    }
  };

  return (
    <Box>
      <div className="flex justify-around mt-24 mb-16 ">
        <NxtCard className=" w-[400px] bg-[#e8ebef]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Search for Scope Statistics by Scope ID</p>

              <p className="text-small text-default-500">
                List satistics for a specific scope
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form action="">
              <div className="flex flex-row md:flex-nowrap gap-4 p-2 ">
                <NxtInput
                  defaultValue={userInput}
                  // isInvalid={MacRegValidation(userInput) === false}
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  radius="lg"
                  placeholder="Scope ID"
                />

                <NxtButton
                  variant="flat"
                  type="submit"
                  isLoading={loading}
                  onClick={handleSubmit}
                  className="p-2 w-1/2 bg-[#f4f4f5] hover:text-green-600 hover:bg-gray-300 disabled:hover:text-red-600 disabled:hover:bg-red-100 "
                  disabled={loading || userInput.length < 8}
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
          textAlign={"center"}
          justifyContent={"center"}
          alignItems={"center"}
          backgroundColor={"gray.200"}
          mb={3}
          mt={24}
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
              Search for Scope Statistics by Scope ID
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
      </Box> */}
      <ThereIsError />

      {dhcpStats !== undefined && dhcpStats.length !== 0 ? (
        <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
          <SearchScopeTable scopeData={scopeData} dhcpStats={dhcpStats} />
          {/* <Box
            backgroundColor={"gray.100"}
            maxW={"450px"}
            w={"100%"}
            boxShadow={"2xl"}
            rounded={"lg"}
            mt={3}
            p={6}
            textAlign={"center"}
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
                    <Th></Th>
                    <Th
                      textAlign={"left"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Scope Info
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
                      Scope Name:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {scopeData.description}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Start Range:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {scopeData.startRange}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      End Range:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {scopeData.endRange}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Subnet Mask:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {scopeData.subnetMask}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      DNS Servers:
                    </Td>

                    {scopeData.dhcpOptions.map((scope) => {
                      if (scope.name === "DNS Servers") {
                        if (scope.value.length === 3) {
                          return (
                            <Td
                              textAlign={"center"}
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              <ul>{scope.value[0]}</ul>
                              <ul>{scope.value[1]}</ul>
                              <ul>{scope.value[2]}</ul>
                            </Td>
                          );
                        } else if (scope.value.length === 2) {
                          return (
                            <Td
                              textAlign={"center"}
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              <ul>{scope.value[0]}</ul>
                              <ul>{scope.value[1]}</ul>
                            </Td>
                          );
                        }
                      }
                    })}
                  </Tr>

                  <Tr>
                    <Th></Th>
                    <Th
                      textAlign={"left"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Scope Statistics
                    </Th>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      IP's Free:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {dhcpStats.free}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      IP's In Use:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {dhcpStats.inUse}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      Percent Used:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {Math.round(dhcpStats.percentageUsed)}%
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      IP's Reserved:
                    </Td>
                    <Td
                      textAlign={"center"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {dhcpStats.reserved}
    
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box> */}
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}

// {/* <Box
//           w={"400px"}
//           boxShadow={"2xl"}
//           mt={6}
//           rounded={"lg"}
//           p={6}
//           textAlign={"center"}
//         >
//           <Heading fontSize={"1xl"} fontFamily={"body"}>
//             Search to Display Scope Data
//           </Heading>
//         </Box> */}
