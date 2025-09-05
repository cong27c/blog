// tools/factory.js
const AgentTool = require("@/models/AgentTool");

async function loadToolsForAgent(agentId) {
  const tools = await AgentTool.findAll({ where: { agent_id: agentId } });
  return tools
    .map((tool) => {
      switch (tool.toolType) {
        case "serpapi":
          return new SerpApiTool(tool.config);
        case "browser":
          return new BrowserTool(tool.config);
        case "customFunction":
          return new CustomFunctionTool(tool.config);
        default:
          return null;
      }
    })
    .filter(Boolean);
}

module.exports = { loadToolsForAgent };
