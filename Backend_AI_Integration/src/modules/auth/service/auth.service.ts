import db from "@/models/index";
const { User, Role } = db as any;
import {
  ISessionUser,
  IDataUser,
  IRegisterUser,
} from "@/modules/auth/interfaces/auth.interface";
import { statusAccount } from "@/constants/common";

class AuthService {
  public async getAuthUserByUsername(
    username: string
  ): Promise<ISessionUser[] | []> {
    const user = await User.findAll({
      where: {
        email: username,
      },
      attributes: [
        "id",
        "fullname",
        "email",
        "status",
        "type",
        "idrole",
        "password",
      ],
      include: {
        model: Role,
        as: "role",
      },
      raw: true,
      nest: true,
    });
    //console.log("__user", user);
    return user;
  }

  public async getDataUserByUsername(
    username: string
  ): Promise<IDataUser[] | []> {
    const user = await User.findAll({
      where: {
        email: username,
      },
      include: {
        model: Role,
        as: "role",
      },
      raw: true,
      nest: true,
    });
    //console.log("__user", user);
    return user;
  }

  public async registerUser(data: IRegisterUser): Promise<any> {
    const user = await User.create({
      id: data.id,
      fullname: data.fullname,
      gender: data.gender,
      email: data.email,
      urlavatar: data.urlavatar,
      status: statusAccount.UNVERIFIED,
      type: data.type,
      password: data.hashPassword,
      idrole: "Role-1720080433589-212485831",
    });
    return user;
  }

  public async checkUserExistByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      return true;
    }
    return false;
  }
}

export const authService: AuthService = new AuthService();
