import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

function renderedImageTags(): string[] {
  return sourceFiles(resolve(process.cwd(), "src")).flatMap((path) => {
    const source = readFileSync(path, "utf8");
    return source.match(/<img\b[^>]*>/g) ?? [];
  });
}

describe("website image accessibility invariants", () => {
  it("declares alt text on every rendered image, including explicit decorative alt", () => {
    const images = renderedImageTags();

    expect(images.length).toBeGreaterThan(0);
    expect(images.every((image) => /\balt\s*=/.test(image))).toBe(true);

    const imagesMarkedDecorative = images.filter((image) => /\baria-hidden\s*=/.test(image));
    expect(imagesMarkedDecorative.every((image) => /\balt\s*=\s*["']{2}/.test(image))).toBe(true);
  });

  it("gives the shared NOVA logo one accessible brand name", () => {
    const logo = readFileSync(resolve(process.cwd(), "src/components/site/Logo.tsx"), "utf8");
    const logoImage = logo.match(/<img\b[^>]*>/)?.[0];

    expect(logo).toContain('alt="NOVA Compliance"');
    expect(logo).toMatch(/<span className="leading-none" aria-hidden="true">/);
    expect(logoImage).toBeDefined();
    expect(logoImage).not.toMatch(/\baria-hidden\s*=/);
  });

  it("gives framework-identifying images content-specific dynamic alt text", () => {
    const frameworks = readFileSync(
      resolve(process.cwd(), "src/routes/frameworks.index.tsx"),
      "utf8",
    );
    const frameworkImages = frameworks.match(/<img\b[^>]*>/g) ?? [];

    expect(frameworkImages).toHaveLength(1);
    expect(
      frameworkImages.every((image) => /alt=\{`\$\{framework\.name\} logo`\}/.test(image)),
    ).toBe(true);
    expect(frameworkImages.some((image) => /\baria-hidden\s*=/.test(image))).toBe(false);
    expect(frameworks.match(/<FrameworkName framework=\{f\} \/>/g)).toHaveLength(2);
  });
});
