export type MarketInput = {
  market: {
    use_browser: Boolean;
    name: string;
    fullname: string;
    market_id: Number;
  };
  url: string;
};

export type Product = {
  url: string;
  market_id: Number;
  name: string;
  internal_id: string;
  primary_image: string | null;
  secondary_images: string[];
  available_to_buy: Boolean;
  price: Number | null;
};
