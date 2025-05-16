export const fetchGraphQL = async <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers']
): Promise<TData> => {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
        ...options,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  const json = await res.json();

  if (json.errors) {
    const { message } = json.errors[0];
    throw new Error(message);
  }

  return json.data;
};
