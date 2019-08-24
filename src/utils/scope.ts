import fetch from "node-fetch";
import { SchematicsException } from "@angular-devkit/schematics";
import { highlight } from "./output";

export const getTeamIdFromSlug = async (slug: string, token: string) => {
  if (slug !== "") {
    try {
      const response = await fetch(
        `https://api.zeit.co/v1/teams?slug=${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const { id } = await response.json();
      return id;
    } catch (e) {
      if (e.code === "team_unauthorized") {
        throw new SchematicsException(
          `You have not enought rights to deploy under team: ${highlight(slug)}`
        );
      }
      throw new SchematicsException(
        `There were problem during team fetching: ${e.message}`
      );
    }
  }
  return undefined;
};
