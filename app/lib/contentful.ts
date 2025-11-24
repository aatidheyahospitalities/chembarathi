import { createClient } from "contentful";

export const contentfulClient = createClient({
  space: process.env.CONTENTFULL_SPACE_ID as string,
  accessToken: process.env.CONTENTFULL_ACCESS_TOKEN as string,
});
