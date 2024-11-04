import React from "react";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { EmailIcon, ArrowForwardIcon } from "@chakra-ui/icons";

/**
 * Renders information about the user obtained from Microsoft Graph
 */
export const ProfileData = (props) => {
  return (
    <div id="profile-div">
      <div>
        <Center py={6} mt={125}>
          <Box
            maxW={"320px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
          >
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {props.graphData.givenName} {props.graphData.surname}
            </Heading>
            <Text fontWeight={600} color={"gray.500"}>
              {props.graphData.mail}
            </Text>
            <Text fontWeight={600} color={"gray.500"} mb={4}>
              {props.graphData.mobilePhone}
            </Text>
            <Text
              textAlign={"center"}
              color={useColorModeValue("gray.700", "gray.400")}
              px={3}
            >
              {props.graphData.jobTitle}
            </Text>
            <Text
              textAlign={"center"}
              color={useColorModeValue("gray.700", "gray.400")}
              px={3}
            >
              {props.graphData.officeLocation}
            </Text>
          </Box>
        </Center>
      </div>
    </div>
  );
};
