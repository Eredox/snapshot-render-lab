import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  staticRoutes,
  dynamicRoutes,
  allRoutes,
  collectInternalNavPaths,
} from "@/config/navigation";

const here = dirname(fileURLToPath(import.meta.url));
const routesDir = join(here, "..");

function staticRouteToFile(route: string): string {
  if (route === "/") return "index.tsx";
  if (route === "/404") return "404.tsx";
  if (route === "/$") return "$.tsx";
  return route.slice(1).replace(/\//g, ".") + ".tsx";
}

function dynamicPatternToFile(pattern: string): string {
  return pattern.slice(1).replace(/\//g, ".") + ".tsx";
}

describe("route integrity", () => {
  it("every static route has a matching route file", () => {
    for (const route of staticRoutes) {
      const file = join(routesDir, staticRouteToFile(route));
      expect(existsSync(file)).toBe(true);
    }
  });

  it("every dynamic route pattern has a matching route file", () => {
    for (const { pattern } of dynamicRoutes) {
      const file = join(routesDir, dynamicPatternToFile(pattern));
      expect(existsSync(file)).toBe(true);
    }
  });

  it("every dynamic slug produces a route present in allRoutes", () => {
    for (const { pattern, slugs } of dynamicRoutes) {
      expect(slugs.length).toBeGreaterThan(0);
      const base = pattern.replace("/$slug", "");
      for (const slug of slugs) {
        expect(allRoutes).toContain(`${base}/${slug}`);
      }
    }
  });

  it("every internal navigation path is in allRoutes", () => {
    const navPaths = collectInternalNavPaths();
    for (const path of navPaths) {
      expect(allRoutes).toContain(path);
    }
  });
});
