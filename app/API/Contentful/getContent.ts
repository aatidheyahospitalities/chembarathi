import { notFound } from 'next/navigation';

type ContentFulParams = {
  query: string;
  variables?: {
    where?: {
      slug?: string;
    };
  };
};

export async function contentfulFetch<T>(params: ContentFulParams): Promise<T> {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFULL_SPACE_ID}/environments/master`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFULL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables,
      }),
    }
  );

  if (!res.ok) {
    console.error('Contentful GraphQL Error:', await res.text());
    notFound();
  }

  const json = await res.json();
  return json.data as T;
}
