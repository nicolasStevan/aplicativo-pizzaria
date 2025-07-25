// Tipos para o React Navigation Stack
export type RootStackParamList = {
  home: undefined;
  order: {
    number: string;
    order_id: string;
  };
  login: undefined;
  index: undefined;
};

// Tipo para os parâmetros da tela Order
export type OrderParams = {
  number: string;
  order_id: string;
};
