export interface CustomerCreationRequest {
  userId: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetNumber: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}
