export interface ShippingAddress {
  customerId: string;
  label: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  streetNumber: string;
  street: string;
  city: string;
  region: string;
  postalCode?: number;
  country: string;
}
