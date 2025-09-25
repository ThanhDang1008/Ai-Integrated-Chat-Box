import db from "@/models/index";
import { statusAccount } from "@/constants/common";
const { User } = db as any;

class MailService {
  public async verifyAccount(email: string) {
    const user = await User.update(
      { status: statusAccount.VERIFIED },
      {
        where: {
          email,
        },
      }
    );
    return user;
  }
}

export const mailService: MailService = new MailService();
