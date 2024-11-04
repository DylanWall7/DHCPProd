import { useForm } from "react-hook-form";
import { FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        resolve();
      }, 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">First name</FormLabel>
        <Input
          id="name"
          placeholder="name"
          {...register("name", {
            required: {
              value: true,
              message: "You must enter a valid IP adress",
            },
            pattern:
              /^10\.((0\.){2}([1-9]|[1-9]\d|[12]\d\d)|0\.([1-9]|[1-9]\d|[12]\d\d)\.([1-9]?\d|[12]\d\d)|([1-9]|[1-9]\d|[12]\d\d)(\.([1-9]?\d|[12]\d\d)){2})$/i,
          })}
        />

        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => <p>{message}</p>}
        />
      </FormControl>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
