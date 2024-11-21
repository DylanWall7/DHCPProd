import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Center,
  Text,
  Stack,
  Button,
  Input,
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
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Button as NxtButton } from "@nextui-org/react";
import { Input as NxtInput } from "@nextui-org/react";

import { useDisclosure } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";
import { GizmoRequest } from "../authConfig";
import { PatchTheReservation, DeleteTheReservation } from "../authConfig";
import { Table } from "rsuite";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { data } from "autoprefixer";

export default function SearchReservation() {
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [loading, setLoading] = useState();
  const [statusCode, setStatusCode] = useState();
  const [displayNoReservation, setDisplayNoReservation] = useState();
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
  const IPreg = RegExp(
    /^10\.((0\.){2}([1-9]|[1-9]\d|[12]\d\d)|0\.([1-9]|[1-9]\d|[12]\d\d)\.([1-9]?\d|[12]\d\d)|([1-9]|[1-9]\d|[12]\d\d)(\.([1-9]?\d|[12]\d\d)){2})$/i
  );
  const Macreg = RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/i);

  const handleSubmit = (event) => {
    setLoading(true);

    if (IPreg.test(userInput) === true) {
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
          let newArray = [];
          newArray.push(response.data);

          setData2(newArray);
        })
        .then(() => {
          setLoading(false);
        })
        .then(() => {
          if (data2.ipAddress > 5) setDisplayNoReservation(true);
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
    } else {
      axios({
        url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/reservation/search/${userInput}`,
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
        .then(() => {
          if (data2.ipAddress > 5) setDisplayNoReservation(true);
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
    }
  };
  // const ThereIsError = (error) => {
  //   if (data2 === null && loading === false) {
  //     return (
  //       <Center w={450} marginLeft={24} marginTop={-6}>
  //         <Text color="red.500">
  //           <b>No Reservations Found!</b>
  //         </Text>
  //       </Center>
  //     );
  //   }
  // };

  const ThereIsError = (error) => {
    if (data2)
      if (data2.length === 0 && loading === false) {
        return (
          <Center marginLeft={-24} marginTop={-6}>
            <Text color="red.500">
              <b>No Reservations Found!</b>
            </Text>
          </Center>
        );
      }
    if (data2[0] === "" && loading === false) {
      return (
        <Center marginLeft={-24} marginTop={-6}>
          <Text color="red.500">
            <b>No Reservations Found!</b>
          </Text>
        </Center>
      );
    }
  };

  useEffect(() => {
    if (data2) {
      data2.map((data) => {
        axios({
          url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/scope/${data?.scopeId}`,
          method: "GET",
          dataResponse: "json",
        })
          .then((response) => {
            setLoading(true);
            setData3(response.data);
          })
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            if (error.code) {
              setLoading(false);
            }
          });
      });
    }
  }, [data2]);

  const { Column, HeaderCell, Cell } = Table;
  const request = {
    ...GizmoRequest,
    account: accounts[0],
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

  // useEffect(() => {
  //   if (statusCode === 201) {
  //     handleSubmit();
  //   }
  // }, [statusCode]);

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
    const data = data2;

    return (
      <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
        {data2[0] ? (
          <Table
            // height={400}
            width={1300}
            autoHeight={true}
            data={data}
            onRowClick={(rowData) => {
              setSelectedRow(rowData);
            }}
          >
            <Column width={110} align="center" style={{ fontSize: 14 }}>
              <HeaderCell>Scope ID</HeaderCell>
              <Cell dataKey="scopeId" />
            </Column>
            <Column
              width={130}
              resizable
              align="center"
              style={{ fontSize: 14 }}
            >
              <HeaderCell>IP Address</HeaderCell>
              <Cell dataKey="ipAddress" />
            </Column>
            <Column
              width={230}
              resizable
              align="center"
              style={{ fontSize: 14 }}
            >
              <HeaderCell>Scope</HeaderCell>
              <Cell>{data3?.name}</Cell>
            </Column>

            <Column
              width={170}
              resizable
              align="center"
              style={{ fontSize: 14 }}
            >
              <HeaderCell>MAC Address</HeaderCell>
              <Cell dataKey="clientId" />
            </Column>

            <Column width={250} resizable aline="left" style={{ fontSize: 14 }}>
              <HeaderCell>Name</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column width={200} resizable align="left" style={{ fontSize: 14 }}>
              <HeaderCell>Description</HeaderCell>
              <Cell dataKey="description" />
            </Column>
            <Column width={80} fixed="right" align="center">
              <HeaderCell>Action</HeaderCell>

              <Cell>
                {(rowData) => (
                  <span>
                    <button
                      class=" mt-0  mb-0 p-1 text-white bg-red-500 rounded-full"
                      type="button"
                      onClick={() => onDeleteOpen(rowData)}
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
                      onClick={() => onEditOpen(rowData)}
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
          </Table>
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

  return (
    <Box>
      <div className="flex justify-center mt-24 mb-16 ">
        <Card className="max-w-[500px] w-[400px] bg-[#e8ebef]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Search for a Reservation</p>
              <p className="text-small text-default-500">Seach by IP or MAC</p>
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
                  placeholder="IP or MAC Address"
                />

                <NxtButton
                  variant="flat"
                  type="submit"
                  isLoading={loading}
                  onClick={handleSubmit}
                  className="p-2 w-1/2 bg-[#f4f4f5] hover:text-green-600 hover:bg-gray-300 disabled:hover:text-red-600 disabled:hover:bg-red-100 "
                  disabled={loading || userInput.length < 4}
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
        justifyContent={"center"}
        marginRight={24}
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
          marginBottom={12}
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
              Search for a Reservation
            </Text>
            <InputGroup>
              <Stack
                direction={["column", "row"]}
                spacing="12px"
                justifyContent={"center"}
                justifyItems={"center"}
                alignItems={"center"}
              >
                <Tooltip
                  bg="gray.300"
                  color="black"
                  label="MAC Partial Matching: 00-1b-78 allowed"
                  aria-label="A tooltip"
                >
                  <Input
                    backgroundColor={"gray.100"}
                    justifyItems={"center"}
                    ml={12}
                    justifyContent={"center"}
                    textAlign={"center"}
                    type="text"
                    placeholder="IP or MAC Address"
                    w={["75%", "75%"]}
                    id="search"
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                  />
                </Tooltip>
       

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
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
