import {Injectable} from "@angular/core";
import {
  selectCustomer,
  selectCustomerError, selectCustomerId,
  selectCustomerLoading,
  selectCustomerOrders
} from "../store/customer/customer.selectors";
import {CustomerState} from "../store/customer/customer.state";
import {Store} from "@ngrx/store";
import * as CustomerActions from '../store/customer/customer.actions';
import {CustomerCreationRequest} from "../models/customer-creation-request.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private store: Store<CustomerState>) {}

  getCustomerOrdersSignal(customerId: string) {
    this.store.dispatch(CustomerActions.getCustomerOrders({ customerId }));
    return this.store.selectSignal(selectCustomerOrders);
  }

  getCustomerLoadingSignal() {
    return this.store.selectSignal(selectCustomerLoading);
  }

  getCustomerErrorSignal() {
    return this.store.selectSignal(selectCustomerError);
  }

  getCustomerProfileSignal(customerId: string) {
    this.store.dispatch(CustomerActions.getCustomerProfile({ customerId }));
    return this.store.selectSignal(selectCustomer);
  }

  createCustomer(customerRequest: CustomerCreationRequest) {
    this.store.dispatch(CustomerActions.createCustomer({ customerRequest }));

    return {
      loading: this.store.selectSignal(selectCustomerLoading),
      error: this.store.selectSignal(selectCustomerError),
      customerId: this.store.selectSignal(selectCustomerId) // Add this line
    };
  }

}
