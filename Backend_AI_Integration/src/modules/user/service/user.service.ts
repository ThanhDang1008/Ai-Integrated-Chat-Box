import db from "@/models/index";
const { User } = db as any;
import { IGetUserById } from "@/modules/user/interfaces/user.interface";

class UserService {
  public async getUserById(id: string): Promise<IGetUserById | null> {
    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password", "idrole"],
      },
      raw: true,
      nest: true,
    });
    //console.log("__getUserById", user);
    return user;
  }
}

export const userService: UserService = new UserService();
