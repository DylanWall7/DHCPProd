import React from "react";
import { PostReservation, PatchTheReservation } from "../authConfig";
import { useMsal } from "@azure/msal-react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { GizmoRequest } from "../authConfig";

export default function UserProfileEdit(data) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const { instance, accounts } = useMsal();
  const [statusCode, setStatusCode] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubButtonLoading, setIsSubButtonLoading] = useState(false);

  const ClientId = React.useMemo(() => {
    return JSON.stringify(data.data.clientId, null, 2);
  });
  const ScopeID = React.useMemo(() => {
    return JSON.stringify(data.data.scopeId, null, 2);
  });
  const IpAddress = React.useMemo(() => {
    return JSON.stringify(data.data.ipAddress, null, 2);
  });
  // const ScopeID = JSON.stringify(data.data.scopeId, null, 2);
  // const IpAddress = JSON.stringify(data.data.ipAddress, null, 2);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ClientId: ClientId.replace(/['"]+/g, ""),
      ScopeId: ScopeID.replace(/['"]+/g, ""),
      IPAddress: IpAddress.replace(/['"]+/g, ""),
    },
  });

  const request = {
    ...GizmoRequest,
    account: accounts[0],
  };

  React.useEffect(() => {
    switch (statusCode) {
      case null:
        break;
      case 201:
        setIsSubButtonLoading(false);
        setTimeout(() => {
          setStatusCode(null);

          onClose();
        }, 5000);

        reset({
          ScopeId: ScopeID.replace(/['"]+/g, ""),
          ClientId: ClientId.replace(/['"]+/g, ""),
          IPAddress: IpAddress.replace(/['"]+/g, ""),
          Description: "",
        });

        break;
      case 400:
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

  // async function getToken() {
  //   await instance.acquireTokenSilent(request).then((response) => {
  //     console.log(response.accessToken);
  //     return response.accessToken;
  //   });
  // }

  async function onCreate(values) {
    setIsSubButtonLoading(true);
    CreateReservation({
      token: await instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
      }),
      data: JSON.stringify(values, null, 2),
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

  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("resolved");
      setIsLoading(false);
    }, 10000);
  });

  return (
    <Box alignItems={"center"} justifyContent={"center"}>
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Flex alignItems={"center"} justifyContent={"center"}>
          <Box
          // alignItems={"right"}
          // justifyContent={"right"}
          // display={"flex"}
          // w={"450px"}
          >
            {/* {isLoading === true && data.data.addressState !== "Active" && (
              <div role="status">
                <svg
                  class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            )} */}
            {/* {isLoading === true && data.data.addressState === "Active" && (
              <div role="status">
                <svg
                  class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            )} */}
            {data.data.addressState !== "Active" && (
              <button
                class=" mt-0  mb-0 p-1 text-white bg-blue-400 rounded-full"
                type="button"
                onClick={onOpen}
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
            )}
            {data.data.addressState === "Active" && (
              <button
                class=" mt-0  mb-0 p-1 text-black bg-green-600 rounded-full"
                type="button"
                onClick={onOpen}
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
            )}

            {/* <Text
              mt={"12px"}
              mr={"15px"}
              ml={"5px"}
              fontSize="sm"
              color="gray.500"
            >
              Add Reservation
            </Text> */}
          </Box>

          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent mt={320}>
              {data.data.addressState !== "Active" && (
                <ModalHeader>Update Reservation Description</ModalHeader>
              )}
              {data.data.addressState === "Active" && (
                <ModalHeader>Add New Reservation</ModalHeader>
              )}

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
                  <AlertDescription>
                    Action Completed Successfully
                  </AlertDescription>
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
                    This Reservation might exist already.
                  </AlertDescription>
                </Alert>
              )}
              <ModalCloseButton />
              <form id="reservation-form">
                <ModalBody pb={6}>
                  <Stack direction={["column", "row"]} spacing={6}></Stack>
                  <FormControl id="ScopeId" isRequired>
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
                  <FormControl id="ClientId" isRequired>
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
                        // pattern: /^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$/i,
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="ClientId"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </FormControl>
                  <FormControl id="IPAddress" isRequired>
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
                  {data.data.addressState === "Active" && (
                    <Button
                      bg={"green.400"}
                      color={"white"}
                      w="full"
                      _hover={{
                        bg: "green.500",
                      }}
                      isLoading={isSubButtonLoading}
                      type="submit"
                      onClick={handleSubmit(onCreate)}
                    >
                      Add New Reservation
                    </Button>
                  )}
                  {data.data.addressState !== "Active" && (
                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      w="full"
                      _hover={{
                        bg: "blue.500",
                      }}
                      isLoading={isSubButtonLoading}
                      type="submit"
                      // onClick={
                      //   handleSubmit(onUpdate) && setIsSubButtonLoading(true)
                      // }
                      onClick={handleSubmit(onUpdate)}
                    >
                      Update Existing Reservation
                    </Button>
                  )}
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </Box>
  );
}
