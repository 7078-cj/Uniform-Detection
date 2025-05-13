import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import classes from "../css/Authentication.module.css";
import logo from "../assets/logo.png";

import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Image,
} from "@mantine/core";

function Login() {
  let { loginUser } = useContext(AuthContext);
  // const nav = useNavigate();

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <div className={classes.centerAvatar}>
          <Image   src={logo} w={120}  />
        </div>

        <form
          onSubmit={loginUser}
          className="flex flex-col justify-center items-center space-y-2"
        >
          <TextInput
            label="Username"
            type="text"
            name="username"
            placeholder="Enter Username"
            required
            mt="md"
            size="md"
            radius="md"
          />
          <PasswordInput
            label="Password"
            type="password"
            name="password"
            id=""
            placeholder="Enter Password"
            required
            mt="md"
            size="md"
            radius="md"
          />
          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            color="teal.9"
          >
            Sign in
          </Button>
        </form>
        <Text ta="center" mt="md">
          Don't have an account?{" "}
          <Anchor href="/register" fw={500}>
            <Text color="teal.8" component="span">
              Register{" "}
            </Text>
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

export default Login;
