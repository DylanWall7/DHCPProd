import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import {
  Input,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
} from "@chakra-ui/react";
import { CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Button as NxtButton } from "@nextui-org/react";
import { Card as NxtCard } from "@nextui-org/react";
import { Input as NxtInput } from "@nextui-org/react";
import { useDisclosure } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";
import { GizmoRequest } from "../authConfig";
import { PostReservation } from "../authConfig";
import { Table } from "rsuite";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import "rsuite/dist/rsuite.min.css";

export default function ConvertToReservation() {
  const [data2, setData2] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState();
  const [statusCode, setStatusCode] = useState();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState();

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const { instance, accounts } = useMsal();
  const [isSubButtonLoading, setIsSubButtonLoading] = useState(false);
  const theRowData = useRef();

  const handleSubmit = (event) => {
    setLoading(true);

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
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const { Column, HeaderCell, Cell } = Table;
  const request = {
    ...GizmoRequest,
    account: accounts[0],
  };

  async function onCreate(values) {
    setIsSubButtonLoading(true);
    CreateReservation({
      token: await instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
      }),
      data: JSON.stringify(values, null, 2),
    });
  }

  async function CreateReservation({ token, data }) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");

    const options = {
      method: "POST",
      headers: headers,
      body: data,
    };

    return fetch(PostReservation.PostReservationEndpoint, options)
      .then((response) => {
        const status = response.status;
        setStatusCode(status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const ThereIsError = (error) => {
    if (data2.length === 0 && loading === false) {
      return (
        <Center marginTop={-6}>
          <Text color="red.500">
            <b>No Leases Found!</b>
          </Text>
        </Center>
      );
    }
  };

  const onChangeInput = React.useCallback((rowData) => {
    theRowData.current = rowData;

    onEditOpen();
  }, []);

  useEffect(() => {
    if (theRowData.current) {
      let defaultValues = {};
      defaultValues.ScopeId = theRowData.current.scopeId;
      defaultValues.ClientId = theRowData.current.clientId;
      defaultValues.IPAddress = theRowData.current.ipAddress;
      defaultValues.Description = "";

      reset({ ...defaultValues });
    }
  }, [theRowData.current]);

  React.useEffect(() => {
    switch (statusCode) {
      case null:
        break;
      case 204:
        setIsSubButtonLoading(false);
        handleSubmit();
        setTimeout(() => {
          setStatusCode(null);
          onDeleteClose();
        }, 3500);
        reset();
        break;
      case 201:
        setIsSubButtonLoading(false);
        handleSubmit();
        setTimeout(() => {
          setStatusCode(null);
          onEditClose();
        }, 3500);
        reset({
          Description: "",
        });
        break;
      case 403:
        setIsSubButtonLoading(false);
        setTimeout(() => {
          setStatusCode(null);
        }, 9000);
        break;
      case 401:
        setIsSubButtonLoading(false);
        setTimeout(() => {
          setStatusCode(null);
        }, 9000);
        break;
      case 400:
        setIsSubButtonLoading(false);
        setTimeout(() => {
          setStatusCode(null);
        }, 9000);
        break;
      default:
        setIsSubButtonLoading(false);
        setTimeout(() => {
          setStatusCode(null);
        }, 5000);

        break;
    }
  }, [statusCode]);

  const {
    handleSubmit: handleDeleteSubmit,
    handleSubmit: handleEditSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      //   // ClientId: ClientId.replace(/['"]+/g, ""),
      //   // ScopeId: ScopeID.replace(/['"]+/g, ""),
      //   // IPAddress: defaultIP,
    },
  });

  function CustomTable() {
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [searchKeyword, setSearchKeyword] = useState("");
    const { Column, HeaderCell, Cell } = Table;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSortColumn = (sortColumn, sortType) => {
      setSortColumn(sortColumn);
      setSortType(sortType);
    };

    const filteredData = () => {
      const filtered = data2.filter((item, v, i) => {
        if (
          !item.clientId.includes(searchKeyword) &&
          !item.ipAddress.includes(searchKeyword)
        ) {
          return false;
        } else return true;
      });

      if (sortColumn && sortType) {
        return filtered.sort((a, b) => {
          let x = a[sortColumn];
          let y = b[sortColumn];
          if (typeof x === "string") {
            x = x.charCodeAt();
          }
          if (typeof y === "string") {
            y = y.charCodeAt(6);
          }

          if (sortType === "asc") {
            return x - y;
          } else {
            return y - x;
          }
        });
      }
      return filtered;
    };

    const styles = {
      border: "none",
      outline: "none",
    };

    const handleChangeLimit = (dataKey) => {
      setPage(1);
      setLimit(dataKey);
    };

    return (
      <>
        {data2.length !== 0 ? (
          <>
            <div className="flex flex-col align-content-center justify-items-center ">
              <Input
                w={200}
                mb={4}
                placeholder="Search Table"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
              <Table
                // height={400}
                align="center"
                width="100%"
                autoHeight={true}
                data={filteredData()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                defaultSortType="asc"

                // onRowClick={(rowData) => {
                //   setSelectedRow(rowData);
                // }}
              >
                <Column
                  width={120}
                  align="center"
                  sortable
                  style={{ fontSize: 14 }}
                >
                  <HeaderCell>IP Address</HeaderCell>
                  <Cell dataKey="ipAddress" />
                </Column>

                <Column
                  width={200}
                  resizable
                  sortable
                  align="center"
                  style={{ fontSize: 14 }}
                >
                  <HeaderCell>MAC Address</HeaderCell>
                  <Cell dataKey="clientId" />
                </Column>

                <Column
                  width={270}
                  resizable
                  aline="left"
                  style={{ fontSize: 14 }}
                >
                  <HeaderCell>Name</HeaderCell>
                  <Cell dataKey="hostName" />
                </Column>

                <Column width={80} fixed="right" align="center" resizable>
                  <HeaderCell>Action</HeaderCell>

                  <Cell>
                    {(rowData) => (
                      <span>
                        {rowData.addressState === "Active" && (
                          <Tooltip
                            bg="gray.300"
                            color="black"
                            label="Convert to Reservation"
                            aria-label="A tooltip"
                          >
                            <button
                              class=" mt-0  mb-0 p-1 text-black bg-green-600 rounded-full"
                              type="button"
                              // onClick={() => alert(JSON.stringify(rowData, null, 2))}
                              onClick={() => onChangeInput(rowData)}
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
                          </Tooltip>
                        )}
                      </span>
                    )}
                  </Cell>
                </Column>
              </Table>
            </div>
            {/* <div style={{ width: "85%", padding: 20 }}>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={["total", "-", "limit", "|", "pager"]}
                total={data2.length}
                limitOptions={[10, 30, 100, 1000]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div> */}
          </>
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

  return (
    <Box>
      <div className="flex justify-around  mt-24 mb-16 ">
        <NxtCard className=" w-[400px] bg-[#e8ebef]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Search for All Leases by Scope ID</p>

              <p className="text-small text-default-500">
                List all leases by scope ID
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
      {/* <Box
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
          backgroundColor={"gray.200"}
          mt={24}
          w={"450px"}
          maxWidth={"450px"}
          mb={12}
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
      </Box> */}
      <ThereIsError />

      <CustomTable data={data2} />

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isEditOpen}
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent mt={320}>
          <ModalHeader>Create Reservation</ModalHeader>
          {statusCode === 201 && (
            <Alert
              mt={0}
              ml={0}
              status="success"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <AlertIcon />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Reservation has been Created.</AlertDescription>
            </Alert>
          )}
          {statusCode === 401 && (
            <Alert
              mt={0}
              ml={0}
              status="error"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <AlertIcon />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>
                You are not authorized. Please re-login.
              </AlertDescription>
            </Alert>
          )}
          {statusCode === 400 && (
            <Alert
              mt={0}
              ml={0}
              status="error"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <AlertIcon />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>
                Reservation MAC already exist.
              </AlertDescription>
            </Alert>
          )}
          {statusCode === 403 && (
            <Alert
              mt={0}
              ml={0}
              status="error"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <AlertIcon />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>
                Something went wrong try again.
              </AlertDescription>
            </Alert>
          )}
          <ModalCloseButton />
          <form id="edit-form">
            <ModalBody pb={6}>
              <Stack direction={["column", "row"]} spacing={6}></Stack>
              <FormControl id="ScopeId">
                <FormLabel>Scope ID</FormLabel>
                <Input
                  placeholder="10.0.133.0"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  errorBorderColor="red.500"
                  {...register("ScopeId", {
                    required: {
                      value: true,
                      message: "You must enter a valid Scope ID",
                    },
                    // pattern:
                    //   /^10\.((0\.){2}([1-9]|[1-9]\d|[12]\d\d)|0\.([1-9]|[1-9]\d|[12]\d\d)\.([1-9]?\d|[12]\d\d)|([1-9]|[1-9]\d|[12]\d\d)(\.([1-9]?\d|[12]\d\d)){2})$/i,
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="ScopeId"
                  render={({ message }) => <p>{message}</p>}
                />
              </FormControl>
              <FormControl id="ClientId">
                <FormLabel>Client ID</FormLabel>
                <Input
                  placeholder="AA-BB-CC-DD-EE-FF"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  errorBorderColor="red.500"
                  {...register("ClientId", {
                    required: {
                      value: true,
                      message: "You must enter a valid Client ID",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="ClientId"
                  render={({ message }) => <p>{message}</p>}
                />
              </FormControl>
              <FormControl id="IPAddress">
                <FormLabel>IP Address</FormLabel>
                <Input
                  placeholder="10.0.133.53"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  errorBorderColor="red.500"
                  {...register("IPAddress", {
                    required: {
                      value: true,
                      message: "You must enter a valid IP Address",
                    },
                    // pattern:
                    //   /^10\.((0\.){2}([1-9]|[1-9]\d|[12]\d\d)|0\.([1-9]|[1-9]\d|[12]\d\d)\.([1-9]?\d|[12]\d\d)|([1-9]|[1-9]\d|[12]\d\d)(\.([1-9]?\d|[12]\d\d)){2})$/i,
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="IPAddress"
                  render={({ message }) => <p>{message}</p>}
                />
              </FormControl>
              <FormControl id="Description" isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Add your description here"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  errorBorderColor="red.500"
                  {...register("Description", {
                    required: {
                      value: true,
                      message: "You must add a valid description",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="Description"
                  render={({ message }) => <p>{message}</p>}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "green.500",
                }}
                isLoading={isSubButtonLoading}
                type="submit"
                onClick={handleEditSubmit(onCreate)}
              >
                Create Reservation
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
