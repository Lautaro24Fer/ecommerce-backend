export interface INotFoundEx {
  status: boolean;
  message: any;
}

export interface IBadRequestex {
  status: boolean;
  message: any;
}

export interface IRecourseDeleted {
  status: boolean;
  message: string;
  recourse: any;
}