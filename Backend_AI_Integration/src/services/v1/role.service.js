import db from "@/models/index";

const createRole = async (data) => {
  try {
    const data_role = await db.Role.create({
      id: "Role-" + Date.now() + "-" + Math.round(Math.random() * 1e9),
      permission: data.permission,
    });
    if (!data_role) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "create role fail!",
          status: "FAIL_ROLE",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "201",
        message: "create role success!",
        data: data_role,
      },
    };
  } catch (error) {
    return {
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    };
  }
};

export { createRole };
