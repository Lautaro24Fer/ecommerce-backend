export interface CreateUserStrategyDto {
  username?: string;
  // Al momento de inicializarse será nulo, luego desde el front create una ventana que le indique al usuario
  // que ingrese su username. Una vez cargado, se actualiza el registro, ya que la idea es hacer este proceso
  // una unica vez ( Cuando el usuario se logea por primera vez )

  password?: string;
  name: string;
  email: string;
  method: string;
  surname: string;
  postalCode?: string;
  idType?: number;
  idNumber?: string;
  addressStreet?: string;
  addressNumber?: string;
}
