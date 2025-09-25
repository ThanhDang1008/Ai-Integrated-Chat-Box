import db from "@/models/index";
import { TIMEZONE_GMT } from "../../shared/utils/timezone";

const createConversation = async (data) => {
  //console.log("check data", data);
  try {
    const data_conversation = await db.Conversation.create({
      id: "conversation-" + Date.now() + "-" + Math.round(Math.random() * 1e9),
      iduser: data.iduser,
      title: data.title,
      content: data.content,
      urlfile: data.urlfile ? data.urlfile : null,
    });
    //console.log("check data_conversation", data_conversation);
    if (!data_conversation) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "create conversation fail!",
          status: "FAIL_CONVERSATION",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "201",
        message: "create conversation success!",
        data: data_conversation,
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

const getDetailConversation = async (data) => {
  try {
    const data_conversation = await db.Conversation.findOne({
      where: {
        id: data.id,
        iduser: data.iduser,
      },
    });
    console.log("check data_conversation", data_conversation);
    if (!data_conversation) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `Conversation ${data.id} not found!`,
          status: "CONVERSATION_NOT_FOUND",
        },
      };
    }
    //console.log("check data_conversation", data_conversation);
    let data_conversation_custom = { ...data_conversation };
    data_conversation_custom.createdAt = TIMEZONE_GMT(
      data_conversation_custom.createdAt,
      7
    );
    data_conversation_custom.updatedAt = TIMEZONE_GMT(
      data_conversation_custom.updatedAt,
      7
    );
    return {
      code: 2,
      data: {
        code: "200",
        message: "get conversation success!",
        data: data_conversation_custom,
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

const updateConversation = async (data) => {
  try {
    const data_conversation = await db.Conversation.update(
      {
        title: data.title,
        content: data.content,
        urlfile: data.urlfile ? data.urlfile : null,
      },
      {
        where: {
          id: data.id,
        },
      }
    );
    //console.log("check data_conversation", data_conversation);
    if (data_conversation[0] === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `update conversation ${data.id} fail!`,
          status: "FAIL_UPDATE_CONVERSATION",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "200",
        message: "update conversation success!",
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

const updateTitleConversation = async (data) => {
  try {
    const data_conversation = await db.Conversation.update(
      {
        title: data.title,
      },
      {
        where: {
          id: data.id,
        },
      }
    );
    //console.log("check data_conversation", data_conversation,typeof data_conversation);//type of array
    if (data_conversation[0] === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `update title conversation ${data.id} fail!`,
          status: "FAIL_UPDATE_TITLE_CONVERSATION",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "200",
        status: "UPDATE_TITLE_CONVERSATION",
        message: `update title conversation ${data.id} success!`,
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

const deleteConversation = async (data) => {
  try {
    const data_conversation = await db.Conversation.destroy({
      where: {
        id: data.id,
      },
    });
    //console.log("check data_conversation", data_conversation,typeof data_conversation);//type of number
    //number of rows affected
    if (data_conversation === 0) {
      return {
        code: 4,
        error: {
          code: "400",
          message: `delete conversation ${data.id} fail!`,
          status: "FAIL_DELETE_CONVERSATION",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "200",
        status: "DELETE_CONVERSATION_SUCCESS",
        message: `delete conversation ${data.id} success!`,
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

const checkExistConversation = async (data) => {
  try {
    const data_conversation = await db.Conversation.findOne({
      attributes: ["id", "title"],
      where: {
        urlfile: data.urlfile,
      },
    });
    //console.log("check data_conversation", data_conversation);//null
    if (!data_conversation) {
      return {
        code: 4,
        error: {
          code: "400",
          message: "conversation not found!",
          status: "CONVERSATION_NOT_FOUND",
        },
      };
    }

    return {
      code: 2,
      data: {
        code: "200",
        status: "CONVERSATION_FOUND",
        message: "conversation found!",
        data: data_conversation,
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

export {
  createConversation,
  getDetailConversation,
  updateConversation,
  updateTitleConversation,
  deleteConversation,
  checkExistConversation,
};
