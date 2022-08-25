import {
    Box,
    Button,
    Stack,
    useColorModeValue,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Heading,
    CloseButton,
    InputGroup,
    InputRightElement,
    HStack,
    Text,
    Checkbox,
    Link,
    VStack
  } from "@chakra-ui/react";
import { Formik, Field } from "formik";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React from "react";
import { UserContext } from "./UserProvider";

const Login = () => {
    const { user, setUser } = React.useContext(UserContext);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);
    const [showRegister, setShowRegister] = React.useState(false);

    React.useEffect(() => {
        setLoggedIn(
          typeof user === "object" &&
            user !== null &&
            user !== undefined &&
            Object.keys(user)?.length > 0
        );
    }, [user]);

    const logoutHandler = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        // try {
        //   fetch("https://localhost:5000/auth/logout", {
        //     method: "PUT",
        //     headers: { "Content-Type": "application/json" },
        //   })
        //     .then((res) => res.json())
        //     .then(async (res) => {
        //       setUser({});
        //       localStorage.removeItem("user");
        //       window.location.href = "/";
        //     });
        // } catch (err) {
        //   console.error(err.message);
        // }
      };

    return (
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          p={3}
        >
      {!loggedIn && showLogin && (
        <LoginCard onClose={() => setShowLogin(false)} onChangeForm={() => {setShowLogin(false);setShowRegister(true)}}/>
      )}
      {!loggedIn && showRegister && (
        <SignupCard onClose={() => setShowRegister(false)} onChangeForm={() => {setShowLogin(true);setShowRegister(false)}}/>
      )}
        {!loggedIn && (
        <Button
            rounded={"full"} 
            px={6}
            as={"a"}
            href={"#"}
            colorScheme={"brand"}
            bg={"brand.500"}
            _hover={{ bg: "brand.400" }}
            onClick={() => setShowLogin(true)}
            >
            Login
        </Button>)}
        {loggedIn && (
        <HStack>
        <Text> {user.username}</Text>
        <Button
            rounded={"full"} 
            px={6}
            as={"a"}
            href={"#"}
            colorScheme={"brand"}
            bg={"brand.500"}
            _hover={{ bg: "brand.400" }}
            onClick={logoutHandler}
            >
            Logout
        </Button>
        </HStack>
        )}
        </Stack>
    );
};



  
function LoginCard({ onClose, onChangeForm }) {
  
    return (
      <Stack maxW={"lg"} px={6} >
        <Box
          style={{ zIndex: "2" }}
          position={"absolute"}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          left={"40%"}
          p={70}
        >
          <CloseButton style={{ float: "right" }} onClick={onClose} />
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} paddingBottom={7}>
              Sign in
            </Heading>
          </Stack>
          <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Field
                    as={Input}
                    id="username"
                    name="username"
                    type="text"
                    variant="filled"
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    validate={(value) => {
                      let error;

                      // if (value.length < 5) {
                      //   error = "Password must contain at least 6 characters";
                      // }

                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Link onClick={onChangeForm} textDecorationLine={'underline'}>I don't have an account</Link>
                </Stack>
                <Button type="submit" 
                  colorScheme={"brand"}
                  bg={"brand.500"}
                  _hover={{ bg: "brand.400" }}
                  rounded={"full"} 
                  px={6}
                  as={"a"}
                  href={"#"} 
                  width="full">
                  Login
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
        </Box>
      </Stack>
    );
}
  


function SignupCard({ onClose, onChangeForm }) {
    const [showPassword, setShowPassword] = React.useState(false);
  
    return (
      <Stack spacing={8} mx={"auto"} maxW={"lg"} px={6}>
        <Box
          left={'35%'}
          style={{ zIndex: "2" }}
          position={"absolute"}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={9}
        >
          <CloseButton style={{ float: "right" }} onClick={onClose} />
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"} paddingBottom={7}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>


          <Formik
          initialValues={{
            email : "",
            password : "",
            username : "",
            firstName : "",
            lastName : "",
            country : "",
            city : "",
            address : "",
            phone : ""
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <HStack>
                <Box>
                  <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Field
                      as={Input}
                      id="username"
                      name="username"
                      type="text"
                      variant="filled"
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                    />
                  </FormControl>
                </Box>
                </HStack>


                <HStack>
                <Box>
                  <FormControl>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Field
                      as={Input}
                      id="firstName"
                      name="firstName"
                      type="text"
                      variant="filled"
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Field
                      as={Input}
                      id="lastName"
                      name="lastName"
                      type="text"
                      variant="filled"
                    />
                  </FormControl>
                </Box>
                </HStack>


                <HStack>
                <Box>
                <FormControl>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <Field
                    as={Input}
                    id="country"
                    name="country"
                    type="text"
                    variant="filled"
                  />
                </FormControl>
                </Box>
                <Box>
                <FormControl>
                  <FormLabel htmlFor="city">City</FormLabel>
                  <Field
                    as={Input}
                    id="city"
                    name="city"
                    type="text"
                    variant="filled"
                  />
                </FormControl>
                </Box>
                </HStack>


                <HStack>
                <Box>
                <FormControl>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    type="tel"
                    variant="filled"
                  />
                </FormControl>
                </Box>
                <Box>
                <FormControl>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    type="text"
                    variant="filled"
                  />
                </FormControl>
                </Box>
                </HStack>



                <HStack>
                <Box>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="filled"
                    validate={(value) => {
                      let error;

                      if (value.length < 5) {
                        error = "Password must contain at least 6 characters";
                      }

                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                </Box>
                <Box>
                <FormControl>
                  <FormLabel htmlFor="confirm">Confirm password</FormLabel>
                  <InputGroup>
                  <Field
                    as={Input}
                    id="confirm"
                    name="confirm"
                    type={showPassword ? "text" : "password"}
                    variant="filled"
                  />
                  <InputRightElement h={"full"}>
                    <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                  </InputGroup>
                </FormControl>
                </Box>
                </HStack>


                <Stack spacing={10}>
                  <Link onClick={onChangeForm} textDecorationLine={'underline'}>I already have an account</Link>
                </Stack>
      
                <FormControl id="checkbox" isRequired>
                  <Checkbox size="lg" colorScheme="brand">
                    <FormLabel>
                      I have read and accept the terms and conditions.
                    </FormLabel>
                  </Checkbox>
                </FormControl>
      
                <Stack spacing={10} pt={2}>

                  <Button
                    type="submit" 
                    px={6}
                    as={"a"}
                    href={"#"} 
                    width="full"
                    loadingText="Submitting"
                    size="lg"
                    colorScheme={"brand"}
                    rounded={"full"} 
                    bg={"brand.500"}
                    _hover={{ bg: "brand.400" }}
                    color={"white"}
                  >
                    Sign up
                  </Button>
                </Stack>
              </VStack>
            </form>
          )}
          </Formik>
  
        </Box>
      </Stack>
    );
  }

export default Login;