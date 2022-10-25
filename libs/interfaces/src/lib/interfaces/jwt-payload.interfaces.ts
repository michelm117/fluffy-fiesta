export interface CreateJwtPayloadInterface {
  userId: number;
}

export interface JwtPayloadInterface extends CreateJwtPayloadInterface {
  exp: number;
  iat: number;
}
