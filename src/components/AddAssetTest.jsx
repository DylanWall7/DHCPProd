import React from "react";
import { PostReservation } from "../authConfig";
import { useMsal } from "@azure/msal-react";

import { loginRequest } from "../authConfig";
import axios from "axios";

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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";

export default function UserProfileEdit() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [showAlert, setShowAlert] = useState(false);
  const [complete, setComplete] = useState();
  const { instance, accounts } = useMsal();
  const [formData, setFormData] = useState();

  const { postResponse, setPostResponse } = useState();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  async function Reservation(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "POST",
      headers: headers,
      body: formData,
    };

    return fetch(PostReservation.PostReservationEndpoint, options)
      .then((response) => response.json()(console.log(response)))

      .catch((error) => console.log(error));
  }

  async function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        resolve();
        setFormData(JSON.stringify(values, null, 2));
        console.log(formData);
        instance
          .acquireTokenSilent(request)
          .then((response) => {
            Reservation(response.accessToken).then((response) =>
              setPostResponse(response)
            );
          })

          .then(() => {
            setComplete(true);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }, 3000);
  }

  console.log(postResponse);

  async function handleAddReservation(accessToken) {
    const form = formData;
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    console.log(bearer);
    headers.append("Authorization", bearer);
    const postResponse = await axios({
      method: "post",
      url: "your_api_url",
      data: form,
      headers: { headers },
    });
  }

  function TokenCalls() {
    const { instance, accounts } = useMsal();

    const [postResponse, setPostResponse] = useState(null);

    function PostTheReservation() {
      const request = {
        ...loginRequest,
        account: accounts[0],
      };

      // Silently acquires an access token which is then attached to a request for Microsoft Graph data
      instance
        .acquireTokenSilent(request)
        .then((response) => {
          Reservation(response.accessToken).then((response) =>
            setPostResponse(response)
          );
        })
        .catch((e) => {
          instance.acquireTokenPopup(request).then((response) => {
            Reservation(response.accessToken).then((response) =>
              setPostResponse(response)
            );
          });
        });
    }
  }

  return (
    <div>
      <Flex align={"center"} justify={"center"}>
        <Flex>
          <button
            class="absolute p-2 text-white bg-green-600 rounded-full -translate-y-1/2 top-46 right-40"
            type="button"
            onClick={onOpen}
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
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent mt={320}>
              <ModalHeader>Add Reservation</ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody pb={6}>
                  <Stack direction={["column", "row"]} spacing={6}></Stack>
                  <FormControl id="serial" isRequired>
                    <FormLabel>serial number</FormLabel>
                    <Input
                      placeholder="10.0.133.0"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                      errorBorderColor="red.500"
                      {...register("serial", {
                        required: {
                          value: true,
                          message: "You must enter a valid Scope ID",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="serial"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </FormControl>
                  <FormControl id="part_id" isRequired>
                    <FormLabel>part_id </FormLabel>
                    <Input
                      placeholder="AA-BB-CC-DD-EE-FF"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                      errorBorderColor="red.500"
                      {...register("part_id", {
                        required: {
                          value: true,
                          message: "You must enter a valid Client ID",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="part_id"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </FormControl>
                  <FormControl id="vendor_id" isRequired>
                    <FormLabel>vendor_id</FormLabel>
                    <Input
                      placeholder="10.0.133.53"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                      errorBorderColor="red.500"
                      {...register("vendor_id", {
                        required: {
                          value: true,
                          message: "You must enter a valid IP Address",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="vendor_id"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </FormControl>
                  <FormControl id="warranty_id" isRequired>
                    <FormLabel>warranty_id</FormLabel>
                    <Input
                      placeholder="Add your description here"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                      errorBorderColor="red.500"
                      {...register("warranty_id", {
                        required: {
                          value: true,
                          message: "You must add a valid description",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="warranty_id
"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </FormControl>
                  <FormControl id="location_id" isRequired>
                    <FormLabel>location_id</FormLabel>
                    <Input
                      placeholder="Add your description here"
                      _placeholder={{ color: "gray.500" }}
                      type="text"
                      errorBorderColor="red.500"
                      {...register("location_id", {
                        required: {
                          value: true,
                          message: "You must add a valid description",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="location_id
"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
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
                  </Button>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "blue.500",
                    }}
                    isLoading={isSubmitting}
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
      {showAlert && (
        <Alert
          mt={50}
          ml={0}
          status="success"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <AlertIcon />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your Reservation has been Added</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
