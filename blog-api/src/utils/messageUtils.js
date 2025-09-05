const { Message } = require("@/models");
const systemUser = 9999;
async function saveUserMessage({ userId, conversationId, content }) {
  return Message.create({
    user_id: userId,
    conversation_id: conversationId,
    content,
    type: "text",
    created_at: new Date(),
    updated_at: new Date(),
  });
}

async function saveAssistantMessage({ agentId, conversationId, content }) {
  return Message.create({
    user_id: systemUser,
    agent_id: agentId,
    conversation_id: conversationId,
    content,
    type: "text",
    created_at: new Date(),
    updated_at: new Date(),
  });
}

function buildPusherPayload(message) {
  return {
    message: {
      id: message.id,
      agent_id: message.agent_id,
      conversation_id: message.conversation_id,
      content: message.content,
      created_at: message.created_at,
    },
  };
}

module.exports = { saveUserMessage, saveAssistantMessage, buildPusherPayload };
