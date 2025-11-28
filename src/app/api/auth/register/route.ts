import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";




const COOKIE_NAME = "tavros_token";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in env");

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { firstName, lastName, email, password, marketingOptIn } =
      await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashed,
      firstName,
      lastName,
      marketingOptIn: !!marketingOptIn,
      role: "user",
    });

    // -----------------------------
    //    🔐 AUTOMATYCZNE LOGOWANIE
    // -----------------------------
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const res = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 201 }
    );

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dni
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
