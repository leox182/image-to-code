import {
  BOOTSTRAP_SYSTEM_PROMPT,
  IONIC_TAILWIND_SYSTEM_PROMPT,
  REACT_BOOTSTRAP_SYSTEM_PROMPT,
  REACT_TAILWIND_SYSTEM_PROMPT,
  TAILWIND_SYSTEM_PROMPT,
  VANILLA_HTML_SYSTEM_PROMPT,
} from "./prompts";

export const getSystemPrompt = (hasVanilla: boolean, frameworkUI: string, frameworkCSS: string) => {
  const ui = frameworkUI?.toUpperCase();
  const css = frameworkCSS?.toUpperCase();

  if (hasVanilla) {
    return VANILLA_HTML_SYSTEM_PROMPT;
  }
  if (ui === "REACT" && css === "TAILWIND") {
    return REACT_TAILWIND_SYSTEM_PROMPT;
  }
  if (ui === "REACT" && !css) {
    return REACT_TAILWIND_SYSTEM_PROMPT;
  }
  if (ui === "REACT" && css === "BOOTSTRAP") {
    return REACT_BOOTSTRAP_SYSTEM_PROMPT;
  }
  if (ui === "IONIC" && css === "TAILWIND") {
    return IONIC_TAILWIND_SYSTEM_PROMPT;
  }
  if (css === "BOOTSTRAP") {
    return BOOTSTRAP_SYSTEM_PROMPT;
  }
  return TAILWIND_SYSTEM_PROMPT;
};
