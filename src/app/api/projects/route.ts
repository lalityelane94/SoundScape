import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { DEFAULT_TRACKS, DEFAULT_AI_TRACK } from "@/types";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const projects = await Project.find({
      $or: [{ ownerId: userId }, { collaborators: userId }],
    }).sort({ updatedAt: -1 });

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();

    await connectDB();
    const project = await Project.create({
      name: name ?? "Untitled Beat",
      ownerId: userId,
      bpm: 120,
      tracks: DEFAULT_TRACKS,
      aiTrack: DEFAULT_AI_TRACK,
      collaborators: [],
    });

    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
