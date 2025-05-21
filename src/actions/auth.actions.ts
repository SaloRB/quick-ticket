"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/db/prisma";
import { removeAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";
import { logEvent } from "@/utils/sentry";

// Register new user
export async function registerUser(
  _: ResponseResult,
  formData: FormData,
): Promise<ResponseResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      logEvent({
        message: "Missing required fields",
        category: "auth",
        level: "warning",
        data: { name, email },
      });

      return {
        success: false,
        message: "Missing required fields",
      };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logEvent({
        message: `Registration failed: User already exists - ${email}`,
        category: "auth",
        level: "warning",
        data: { email },
      });

      return {
        success: false,
        message: "User already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Sign and set auth token
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);

    logEvent({
      message: `User registered successfully: ${email}`,
      category: "auth",
      level: "info",
      data: { userId: user.id, email },
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  }
  catch (error) {
    logEvent({
      message: "Unexpected error during registration",
      category: "auth",
      level: "error",
      error,
    });
    return {
      success: false,
      message: "Registration failed",
    };
  }
}

// Log user out and remove auth cookie
export async function logoutUser(): Promise<ResponseResult> {
  try {
    await removeAuthCookie();

    logEvent({
      message: "User logged out successfully",
      category: "auth",
      level: "info",
    });

    return {
      success: true,
      message: "Logout successful",
    };
  }
  catch (error) {
    logEvent({
      message: "Unexpected error during logout",
      category: "auth",
      level: "error",
      error,
    });
    return {
      success: false,
      message: "Logout failed. Please try again.",
    };
  }
}
