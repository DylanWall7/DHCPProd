import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Center, Text } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { useDisclosure } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";
import { GizmoRequest } from "../authConfig";
import { PatchTheReservation, DeleteTheReservation } from "../authConfig";
import { useForm } from "react-hook-form";
import SearchBox from "./SearchBox";

export default function SearchMAC() {
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
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
  const Macreg = RegExp(/^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$/i);

  const MacRegValidation = (userInput) => {
    if (Macreg.test(userInput) === true) {
      return true;
    }
    return false;
  };

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
        url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/leases/mac/${userInput}`,
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

  useEffect(() => {
    if (data2) {
      data2.map((data) => {
        console.log(data.scopeId);
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
        console.log(data3);
      });
    }
  }, [data2]);

  const ThereIsError = (error) => {
    if (data2)
      if (data2.length === 0 && loading === false) {
        return (
          <Center marginTop={-6}>
            <Text color="red.500">
              <b>No MAC Address Found!</b>
            </Text>
          </Center>
        );
      }
    if (data2[0] === "" && loading === false) {
      return (
        <Center marginTop={-6}>
          <Text color="red.500">
            <b>No MAC Address Found!</b>
          </Text>
        </Center>
      );
    }
  };

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
      <div className="m-5">
        {data.length !== 0 ? (
          <SearchBox data={data} data3={data3} className="mb-5"></SearchBox>
        ) : (
          ""
        )}
      </div>
    );
  }

  const Title = "Search for a Lease by MAC";
  const Description = "MAC Format: 00-1b-78";

  return (
    <Box>
      <div className="flex justify-center mt-24 mb-16 ">
        <Card className="max-w-[500px] w-[400px] bg-[#e8ebef]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">{Title}</p>
              <p className="text-small text-default-500">{Description}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form action="">
              <div className="flex flex-row md:flex-nowrap gap-4 p-2 ">
                <Input
                  defaultValue={userInput}
                  // isInvalid={MacRegValidation(userInput) === false}
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  radius="lg"
                  placeholder="Mac Address"
                />

                <Button
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
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      <ThereIsError />

      <CustomTable data={data2} data3={data3} />
    </Box>
  );
}
