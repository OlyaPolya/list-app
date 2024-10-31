type ApiInfoType = {
  count: string;
  pages: string;
  next?: string;
  prev?: string;
};

export type ApiResultsType =  {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

export type ApiResponseType = {
  info: ApiInfoType;
  results: ApiResultsType[];
};


export type CardType = {
  character: ApiResultsType;
  onDelete: (id: number) => () => void;
  onEditName: (id: number, name: string) => () => void;
}
