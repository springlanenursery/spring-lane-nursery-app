import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

interface AboutMeFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  preferredName?: string;
  languagesSpoken?: string;
  siblings?: string;
  personality?: string;
  emotionalExpression?: string;
  fearsOrDislikes?: string;
  feedsThemselves?: string;
  preferredFoods?: string;
  foodsToAvoid?: string;
  usesCutlery?: string;
  takesNaps?: string;
  napTime?: string;
  comfortItem?: string;
  sleepRoutine?: string;
  toiletTrained?: string;
  toiletUse: string[];
  toiletingRoutines?: string;
  favouriteToys?: string;
  favouriteSongs?: string;
  whatMakesHappy?: string;
  parentalHopes?: string;
  concerns?: string;
}

interface AboutMeDocument extends AboutMeFormData {
  aboutMeReference: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "nursery_app");
  cachedDb = db;
  return db;
}

async function sendAboutMeEmail(
  data: AboutMeFormData,
  aboutMeRef: string
): Promise<void> {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2AA631 0%, #34ce57 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin: 20px 0; }
        .section h3 { color: #2AA631; border-bottom: 2px solid #2AA631; padding-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New All About Me Form</h1>
          <p>Reference: ${aboutMeRef}</p>
        </div>
        <div class="content">
          <div class="section">
            <h3>Child's Details</h3>
            <div class="field"><span class="label">Full Name:</span> <span class="value">${
              data.childFullName
            }</span></div>
            <div class="field"><span class="label">Date of Birth:</span> <span class="value">${new Date(
              data.childDOB
            ).toLocaleDateString()}</span></div>
            ${
              data.preferredName
                ? `<div class="field"><span class="label">Preferred Name:</span> <span class="value">${data.preferredName}</span></div>`
                : ""
            }
            ${
              data.languagesSpoken
                ? `<div class="field"><span class="label">Languages:</span> <span class="value">${data.languagesSpoken}</span></div>`
                : ""
            }
            ${
              data.siblings
                ? `<div class="field"><span class="label">Siblings:</span> <span class="value">${data.siblings}</span></div>`
                : ""
            }
          </div>

          ${
            data.personality
              ? `
          <div class="section">
            <h3>Personality & Behaviour</h3>
            <div class="field"><span class="label">Personality:</span> <span class="value">${
              data.personality
            }</span></div>
            ${
              data.emotionalExpression
                ? `<div class="field"><span class="label">Emotional Expression:</span> <span class="value">${data.emotionalExpression}</span></div>`
                : ""
            }
            ${
              data.fearsOrDislikes
                ? `<div class="field"><span class="label">Fears/Dislikes:</span> <span class="value">${data.fearsOrDislikes}</span></div>`
                : ""
            }
          </div>
          `
              : ""
          }

          <div class="section">
            <h3>Eating & Drinking</h3>
            ${
              data.feedsThemselves
                ? `<div class="field"><span class="label">Feeds Themselves:</span> <span class="value">${data.feedsThemselves}</span></div>`
                : ""
            }
            ${
              data.preferredFoods
                ? `<div class="field"><span class="label">Preferred Foods:</span> <span class="value">${data.preferredFoods}</span></div>`
                : ""
            }
            ${
              data.foodsToAvoid
                ? `<div class="field"><span class="label">Foods to Avoid:</span> <span class="value">${data.foodsToAvoid}</span></div>`
                : ""
            }
            ${
              data.usesCutlery
                ? `<div class="field"><span class="label">Uses Cutlery:</span> <span class="value">${data.usesCutlery}</span></div>`
                : ""
            }
          </div>

          <div class="section">
            <h3>Sleeping & Comfort</h3>
            ${
              data.takesNaps
                ? `<div class="field"><span class="label">Takes Naps:</span> <span class="value">${data.takesNaps}</span></div>`
                : ""
            }
            ${
              data.napTime
                ? `<div class="field"><span class="label">Nap Time:</span> <span class="value">${data.napTime}</span></div>`
                : ""
            }
            ${
              data.comfortItem
                ? `<div class="field"><span class="label">Comfort Item:</span> <span class="value">${data.comfortItem}</span></div>`
                : ""
            }
            ${
              data.sleepRoutine
                ? `<div class="field"><span class="label">Sleep Routine:</span> <span class="value">${data.sleepRoutine}</span></div>`
                : ""
            }
          </div>

          <div class="section">
            <h3>Toileting</h3>
            ${
              data.toiletTrained
                ? `<div class="field"><span class="label">Toilet Trained:</span> <span class="value">${data.toiletTrained}</span></div>`
                : ""
            }
            ${
              data.toiletUse.length > 0
                ? `<div class="field"><span class="label">Uses:</span> <span class="value">${data.toiletUse.join(
                    ", "
                  )}</span></div>`
                : ""
            }
            ${
              data.toiletingRoutines
                ? `<div class="field"><span class="label">Routines:</span> <span class="value">${data.toiletingRoutines}</span></div>`
                : ""
            }
          </div>

          <div class="section">
            <h3>Likes & Interests</h3>
            ${
              data.favouriteToys
                ? `<div class="field"><span class="label">Favourite Toys:</span> <span class="value">${data.favouriteToys}</span></div>`
                : ""
            }
            ${
              data.favouriteSongs
                ? `<div class="field"><span class="label">Favourite Songs/Books:</span> <span class="value">${data.favouriteSongs}</span></div>`
                : ""
            }
            ${
              data.whatMakesHappy
                ? `<div class="field"><span class="label">What Makes Happy:</span> <span class="value">${data.whatMakesHappy}</span></div>`
                : ""
            }
          </div>

          ${
            data.parentalHopes
              ? `
          <div class="section">
            <h3>Parental Hopes & Goals</h3>
            <p>${data.parentalHopes}</p>
            ${
              data.concerns
                ? `<p><strong>Concerns:</strong> ${data.concerns}</p>`
                : ""
            }
          </div>
          `
              : ""
          }

          <p style="margin-top: 30px;">Submitted: ${currentDate} at ${currentTime}</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
          <p>Reference: ${aboutMeRef}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const parentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2AA631 0%, #34ce57 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .reference { background: #2AA631; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #2AA631; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>All About Me Form Received</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>✓ Successfully Submitted</h2>
            <p>Thank you for sharing about ${data.childFullName}!</p>
          </div>

          <div class="reference">
            <p><strong>Reference Number</strong></p>
            <h2>${aboutMeRef}</h2>
          </div>

          <div class="info-box">
            <h3>What This Helps Us Do</h3>
            <ul>
              <li>Understand your child's unique personality and needs</li>
              <li>Create a personalized settling-in plan</li>
              <li>Support your child's routines and preferences</li>
              <li>Build strong relationships from day one</li>
            </ul>
          </div>

          <p>This information helps us provide the best possible care tailored to ${data.childFullName}'s individual needs.</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: adminEmail,
        Subject: `New All About Me Form - ${data.childFullName} - ${aboutMeRef}`,
        HtmlBody: adminHtml,
      }),
    });

    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: data.parentName,
        Subject: `All About Me Form Received - ${data.childFullName}`,
        HtmlBody: parentHtml,
      }),
    });

    console.log("All About Me emails sent successfully");
  } catch (error) {
    console.error("Error sending All About Me email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AboutMeFormData;

    const db = await connectToDatabase();
    const collection = db.collection<AboutMeDocument>("aboutme_forms");

    const aboutMeRef = `ABOUTME-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const aboutMeForm: AboutMeDocument = {
      aboutMeReference: aboutMeRef,
      ...body,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(aboutMeForm);

    sendAboutMeEmail(body, aboutMeRef).catch((error) => {
      console.error("Failed to send All About Me email:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: `All About Me form submitted successfully for ${body.childFullName}`,
        data: {
          aboutMeId: result.insertedId,
          aboutMeReference: aboutMeRef,
          childName: body.childFullName,
          submittedAt: aboutMeForm.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing All About Me form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your form",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}
