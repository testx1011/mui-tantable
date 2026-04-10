# AGENTS.md

## Storybook MCP

When working with UI components, always use the `storybook-mcp` MCP tools to access Storybook's component and documentation before answering or taking any action.

- **CRITICAL: Never hallucinate component properties!** Before using ANY property on a component from this design system (including common-sounding ones like `shadow`, etc.), you MUST use the MCP tools to check if the property is actually documented for that component.
- Query `list-all-documentation` to get a list of all documented components
- Query `get-documentation` for a specific component to see all available props and examples
- Only use properties that are explicitly documented or shown in example stories
- If a property isn't documented, do not assume properties based on naming conventions or common patterns from other libraries. Check back with the user in these cases.
- Use the `get-storybook-story-instructions` tool to fetch the latest instructions for creating or updating stories. This will ensure you follow current conventions and recommendations.
- Check your work by running `run-story-tests`

Remember: A story name might not reflect the property name correctly, so always verify properties through documentation or example stories before using them.

## Available MCP Tools

### Development

- `get-storybook-story-instructions` - Get instructions for writing stories
- `preview-stories` - Preview stories in your chat interface

### Docs

- `get-documentation` - Get detailed documentation for a specific component
- `get-documentation-for-story` - Get full story with associated documentation
- `list-all-documentation` - List all documented components

### Testing

- `run-story-tests` - Run tests for specific stories (includes accessibility checks)
