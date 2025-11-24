import { contentfulClient } from "../contentful";
import { MetaData } from "../type";

export async function getContent() {
  const res = await contentfulClient.getEntries({
    content_type: "home",
  });

  return res;
}

export async function getMetaData() {
  const res = await contentfulClient.getEntries({
    content_type: "home",
  });

  return (res.items[0]?.fields.metaData as MetaData) || {};
}
