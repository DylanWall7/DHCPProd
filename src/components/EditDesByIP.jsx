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
  const [clientId, setClientId] = useState();

  const IpAddress = JSON.stringify(data.data.ipAddress, null, 2);
  const ScopeID = JSON.stringify(data.data.scopeId, null, 2);
  // const IpAddress = JSON.stringify(data.data.ipAddress, null, 2);

  React.useEffect(() => {
    setClientId(data.data.clientId);
  }, [data.data.clientId]);

  const CLIENTID = JSON.stringify(clientId, null, 2);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ClientId: CLIENTID,
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
          ScopeId: "",
          ClientId: "",
          IPAddress: "",
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
    CreateReservation({
      token: await instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
      }),
      data: JSON.stringify(values, null, 2),
    });
    setIsSubButtonLoading(true);
  }

  async function onUpdate(values) {
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
            <button
              class=" mt-0  ml-3 mb-0 p-1 text-white bg-blue-400 rounded-full"
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
              <ModalHeader>Edit Reservation Description</ModalHeader>
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
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </Box>
  );
}
