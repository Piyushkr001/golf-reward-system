import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Configure the transporter securely utilizing environment mappings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.SMTP_USER, // Routing back to the admin email natively
        replyTo: email,
        subject: `[PlayLance Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                <h2 style="color: #0ea5e9;">New Contact Message | PlayLance</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr style="border-top: 1px solid #e2e8f0; my-4;" />
                <p style="white-space: pre-wrap;">${message}</p>
            </div>
        `,
    };

    // Send payload safely
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Communication API Error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
  }
}
