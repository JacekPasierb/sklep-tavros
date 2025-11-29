import {NextResponse} from "next/server";
import {hash} from "bcryptjs";
import {connectToDatabase} from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const {firstName, lastName, email, password, marketingOptIn} =
      await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {message: "Missing required fields"},
        {status: 400}
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({email: normalizedEmail});
    if (existing) {
      return NextResponse.json(
        {message: "Email already in use"},
        {status: 409}
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

    return NextResponse.json(
      {id: user._id.toString(), email: user.email},
      {status: 201}
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({message: "Server error"}, {status: 500});
  }
}
