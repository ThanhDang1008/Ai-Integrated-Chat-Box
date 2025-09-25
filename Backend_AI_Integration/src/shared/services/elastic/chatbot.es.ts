import { BaseElastic } from "./base.es";
import { ServerError } from "@global/helpers/error-handler";

import type {
  ResultSearch,
  schemeChatbot,
} from "@/modules/elastic/interfaces/es.interface";

class ChatbotElastic extends BaseElastic {
  constructor() {
    super("ChatbotElastic");
  }

  public async searchChatbot(
    value: string
  ): Promise<ResultSearch[] | []> {
    try {
      const result = await this.client.search<schemeChatbot>({
        index: "chat_bot_ctuet",
        body: {
          query: {
            multi_match: {
              query: value,
              fields: ["title^2", "description"],
              //ưu tiên tìm kiếm theo title
              fuzziness: "AUTO",
              operator: "or",
              minimum_should_match: "75%",
              fuzzy_transpositions: true,
            },
          },
          size: 2,
          sort: [{ _score: { order: "desc" } }],
        },
      });
      //console.log("result", result);

      const data = result.hits.hits;
      return data as ResultSearch[] | [];
    } catch (error) {
      this.log.error("Error searching chatbot", error);
      return [];
      //throw new ServerError("Error searching chatbot", "ELASTIC_ERROR");
    }
  }

  public async createChatbot(data: schemeChatbot): Promise<void> {
    try {
      await this.client.index({
        index: "chat_bot_ctuet",
        id: data.id,
        document: data,
      });
    } catch (error) {
      this.log.error("Error creating chatbot", error);
      //throw new ServerError("Error creating chatbot", "ELASTIC_ERROR");
    }
  }

  public async updateChatbot(data: schemeChatbot): Promise<void> {
    try {
      await this.client.update({
        index: "chat_bot_ctuet",
        id: data.id,
        doc: data,
      });
    } catch (error) {
      this.log.error("Error updating chatbot", error);
      //throw new ServerError("Error updating chatbot", "ELASTIC_ERROR");
    }
  }

  public async deleteChatbot(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: "chat_bot_ctuet",
        id: id,
      });
    } catch (error) {
      this.log.error("Error deleting chatbot", error);
      //throw new ServerError("Error deleting chatbot", "ELASTIC_ERROR");
    }
  }
}

export const chatbotElastic: ChatbotElastic = new ChatbotElastic();
