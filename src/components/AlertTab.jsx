import {
  Box,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertIcon,
} from "@chakra-ui/react";

export default function AlertTab() {
  return (
    <Box>
      <Alert mt={600} ml={15} w={465} status="success">
        <AlertIcon />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>Your Reservation has been Added</AlertDescription>
      </Alert>
    </Box>
  );
}
