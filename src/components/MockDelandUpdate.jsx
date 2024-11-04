import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, Divider, user } from "@nextui-org/react";
import { Button as NxtButton } from "@nextui-org/react";
import { Input as NxtInput } from "@nextui-org/react";

import { useDisclosure } from "@chakra-ui/react";

import { useMsal } from "@azure/msal-react";
import { GizmoRequest } from "../authConfig";
import { PatchTheReservation, DeleteTheReservation } from "../authConfig";
import { Table } from "rsuite";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import AddResNoLease from "./AddResNoLease";

export default function DeleteReservation() {
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

  const handleSubmit = (event) => {
    setLoading(true);

    axios({
      url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/reservations/${userInput}`,
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

  const ThereIsError = (error) => {
    if (data2.length === 0 && loading === false) {
      return (
        <Center marginTop={-6}>
          <Text color="red.500">
            <b>No Reservations Found!</b>
          </Text>
        </Center>
      );
    }
  };

  async function onDelete(values) {
    setIsSubButtonLoading(true);
    DeleteReservation({
      token: await instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
      }),
      data: JSON.stringify(values, null, 2),
    });
  }

  async function DeleteReservation({ token, data }) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");

    const options = {
      method: "DELETE",
      headers: headers,
      body: data,
    };

    return fetch(DeleteTheReservation.DeleteTheReservationEndpoint, options)
      .then((response) => {
        const status = response.status;
        setStatusCode(status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function onUpdate(values) {
    setIsSubButtonLoading(true);
    PatchReservation({
      token: await instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
      }),
      data: JSON.stringify(values, null, 2),
    });
    setIsSubButtonLoading(true);
  }

  async function PatchReservation({ token, data }) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");

    const options = {
      method: "PATCH",
      headers: headers,
      body: data,
    };

    return fetch(PatchTheReservation.PatchTheReservationEndpoint, options)
      .then((response) => {
        const status = response.status;
        setStatusCode(status);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    if (selectedRow) {
      let defaultValues = {};
      defaultValues.ScopeId = selectedRow.scopeId;
      defaultValues.ClientId = selectedRow.clientId;
      defaultValues.IPAddress = selectedRow.ipAddress;
      defaultValues.Description = selectedRow.description;

      reset({ ...defaultValues });
    }
  }, [selectedRow]);

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

    const handleSortColumn = (sortColumn, sortType) => {
      setSortColumn(sortColumn);
      setSortType(sortType);
    };

    const filteredData = () => {
      const data = data2.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
      });
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
            y = y.charCodeAt(11);
          }
          if (typeof y === "string") {
            y = y.charCodeAt();
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
            <div className="flex flex-col">
              <Input
                w={200}
                mb={4}
                placeholder="Search Table"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
              <Table
                // height={400}

                autoHeight={true}
                autoWidth={true}
                data={filteredData()}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                defaultSortType="desc"
                // onRowClick={(rowData) => {
                //   setSelectedRow(rowData);
                // }}
              >
                <Column width={80} align="center" resizable>
                  <HeaderCell>Action</HeaderCell>

                  <Cell>
                    {(rowData) => (
                      <span>
                        <button
                          class=" mt-0  mb-0 p-1 text-white bg-red-500 rounded-full"
                          type="button"
                          onClick={() => [
                            setSelectedRow(rowData),
                            onDeleteOpen(rowData),
                          ]}
                        >
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="-32 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" />
                          </svg>
                        </button>

                        <button
                          class=" ml-2 mt-0  mb-0 p-1 text-white bg-blue-400 rounded-full"
                          type="button"
                          onClick={() => [
                            setSelectedRow(rowData),
                            onEditOpen(rowData),
                          ]}
                        >
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" />
                            </g>
                          </svg>
                        </button>
                      </span>
                    )}
                  </Cell>
                </Column>
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
                  align="center"
                  style={{ fontSize: 14 }}
                  sortable
                >
                  <HeaderCell>MAC Address</HeaderCell>
                  <Cell dataKey="clientId" />
                </Column>

                <Column
                  width={270}
                  resizable
                  sortable
                  aline="left"
                  style={{ fontSize: 14 }}
                >
                  <HeaderCell>Name</HeaderCell>
                  <Cell dataKey="name" />
                </Column>

                <Column
                  width={225}
                  resizable
                  align="left"
                  style={{ fontSize: 14 }}
                >
                  <HeaderCell>Description</HeaderCell>
                  <Cell dataKey="description" />
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
                limitOptions={[10, 30, 50]}
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
      <div className="flex justify-around mt-24 mb-16 ">
        <Card className="max-w-[500px] w-[400px] bg-[#e8ebef]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Search for All Reservations by Scope ID</p>
              <div className="flex gap-2  items-center ">
                <p className="text-small text-default-500">
                  Add Reservation Manually
                </p>
                <AddResNoLease />
              </div>
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
        </Card>
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
              Search for All Reservations by Scope ID
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
                <AddResNoLease />
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
          <ModalHeader>Update Reservation Description</ModalHeader>
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
              <AlertDescription>Reservation has been Updated.</AlertDescription>
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
              {/* <Button
                    bg={"red.400"}
                    onClick={onClose}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "red.500",
                    }}
                    mr={6}
                  >
                    Cancel
                  </Button> */}

              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                isLoading={isSubButtonLoading}
                type="submit"
                onClick={handleEditSubmit(onUpdate)}
              >
                Update Description
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      >
        <ModalOverlay />
        <ModalContent mt={320}>
          <ModalHeader>Delete Reservation</ModalHeader>
          {statusCode === 204 && (
            <Alert
              mt={0}
              ml={0}
              status="success"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <AlertIcon />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Reservation has been Deleted.</AlertDescription>
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
              <FormControl id="Description">
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Add your description here"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  errorBorderColor="red.500"
                  {...register("Description", {
                    required: {
                      value: false,
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
              {/* <Button
                    bg={"red.400"}
                    onClick={onClose}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "red.500",
                    }}
                    mr={6}
                  >
                    Cancel
                  </Button> */}

              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                isLoading={isSubButtonLoading}
                type="submit"
                onClick={handleEditSubmit(onDelete)}
              >
                Delete Reservation
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
