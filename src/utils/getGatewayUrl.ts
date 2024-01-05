interface Params {
  account_id: string;
  endpoint: string;
  slug: string;
  provider: string;
  model: string;
}

export const getGatewayUrl = (data: Params) => {
  const { endpoint, account_id, slug, provider, model } = data;

  return `${endpoint}/${account_id}/${slug}/${provider}/${model}`;
};
