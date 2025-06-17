import express, { type Request, type Response } from "express";
import EmailService from "./services/email-service";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const { sendEmail } = new EmailService();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  }),
);

app.post("/contact", async (req: Request, res: Response) => {
  return sendEmail(req, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
