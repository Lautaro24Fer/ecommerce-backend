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

export interface IRecourseFound {
  status: boolean;
  message: string;
  recourse: any;
}

export interface IRecourseCreated {
  status: boolean;
  message: string;
  recourse: any;
}

export interface IRecourseUpdated {
  status: boolean;
  message: string;
  recourse: any;
}