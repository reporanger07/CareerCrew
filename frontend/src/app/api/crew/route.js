import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { userInput } = await req.json();
    const backendPath = "C:\\project\\careerguideai_2\\career_guide_ai\\src\\career_guide_ai\\main.py";
    const pythonPath = "C:\\Users\\Abdul Samad\\.conda\\envs\\crewai\\python.exe";
    const reportPath = "C:\\project\\careerguideai_2\\career_guide_ai\\report.md";

    console.log(" Running Python CrewAI process...");

    //  Run Python and WAIT for it to complete
    const output = await new Promise((resolve, reject) => {
      exec(`"${pythonPath}" "${backendPath}" "${userInput}"`,  { cwd: "C:\\project\\careerguideai_2\\career_guide_ai" }, (error, stdout, stderr) => {
        if (error) {
          console.error(" Python error:", stderr || error.message);
          reject(stderr || error.message);
        } else {
          console.log(" Python finished running.");
          resolve(stdout);
        }
      });
    });

    //  Wait until report.md exists and is updated
    console.log(" Waiting for report.md to update...");
    await new Promise((resolve, reject) => {
      let checks = 0;
      const interval = setInterval(() => {
        if (fs.existsSync(reportPath)) {
          const stats = fs.statSync(reportPath);
          const modifiedAgo = Date.now() - stats.mtimeMs;
          if (modifiedAgo < 5000) { // updated within last 5 seconds
            clearInterval(interval);
            resolve();
          }
        }
        if (++checks > 10) { // wait up to ~10 seconds
          clearInterval(interval);
          reject("report.md did not update in time");
        }
      }, 1000);
    });

    //  Read latest report content
    const report = fs.readFileSync(reportPath, "utf-8");

    //  Save report to MongoDB
    await client.connect();
    const db = client.db("career_ai");
    const collection = db.collection("reports");

    const result = await collection.insertOne({
      input: userInput,
      report,
      createdAt: new Date(),
    });

    //  Return result
    return NextResponse.json({ success: true, report, id: result.insertedId });

  } catch (error) {
    console.error(" Error:", error);
    return NextResponse.json({ success: false, error: error.toString() });
  } finally {
    await client.close();
  }
}
