export const STYLE_OPTIONS = [
  {
    value: "ghibli",
    label: "Ghibli",
    prompt:
      "in a whimsical hand-painted animation style inspired by warm storybook fantasy, lush scenery, expressive characters, and soft cinematic light",
  },
  {
    value: "cartoon",
    label: "Cartoon",
    prompt:
      "as a polished cartoon illustration with clean outlines, playful expressions, saturated colors, and friendly shapes",
  },
  {
    value: "anime",
    label: "Anime",
    prompt:
      "as a vibrant anime scene with dynamic composition, crisp detail, dramatic lighting, and expressive character design",
  },
  {
    value: "watercolor",
    label: "Watercolor",
    prompt:
      "as a delicate watercolor painting with layered pigment, soft edges, textured paper, and airy atmosphere",
  },
];

export function buildImagePrompt(prompt, style) {
  const selectedStyle =
    STYLE_OPTIONS.find((option) => option.value === style) || STYLE_OPTIONS[0];

  return `Create a high-quality image ${selectedStyle.prompt}. Main request: ${prompt}.`;
}
